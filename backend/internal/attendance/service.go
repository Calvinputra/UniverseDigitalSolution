package attendance

import (
    "context"
    "errors"
	"gorm.io/gorm"
)

var ErrAlreadyRegistered = errors.New("email already registered for this event")

type Service interface {
    Attend(ctx context.Context, input AttendInput) (*Attendance, error)
    ListByEvent(ctx context.Context, eventID int64) ([]Attendance, error)
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo: repo}
}

type AttendInput struct {
    EventID  int64  `json:"event_id"`
    FullName string `json:"full_name"`
    Email    string `json:"email"`
}

func (s *service) Attend(ctx context.Context, input AttendInput) (*Attendance, error) {
    existing, err := s.repo.FindByEventAndEmail(ctx, input.EventID, input.Email)
    if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, err
    }
    if existing != nil {
        return nil, ErrAlreadyRegistered
    }

    record := Attendance{
        EventID:  input.EventID,
        FullName: input.FullName,
        Email:    input.Email,
        Status:   "registered",
    }

    if err := s.repo.Create(ctx, &record); err != nil {
        return nil, err
    }

    return &record, nil
}

func (s *service) ListByEvent(ctx context.Context, eventID int64) ([]Attendance, error) {
    return s.repo.FindByEventID(ctx, eventID)
}
