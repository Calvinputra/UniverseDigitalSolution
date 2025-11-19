package attendance

import "context"

type Service interface {
	Attend(ctx context.Context, input AttendInput, userID int64) (*Attendance, error)
	ListByEvent(ctx context.Context, eventID int64) ([]Attendance, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

type AttendInput struct {
	EventID int64  `json:"event_id"`
	Status  string `json:"status"`
}

func (s *service) Attend(ctx context.Context, input AttendInput, userID int64) (*Attendance, error) {
	record := Attendance{
		EventID: input.EventID,
		UserID:  userID,
		Status:  input.Status,
	}

	if record.Status == "" {
		record.Status = "registered"
	}

	if err := s.repo.Create(ctx, &record); err != nil {
		return nil, err
	}

	return &record, nil
}

func (s *service) ListByEvent(ctx context.Context, eventID int64) ([]Attendance, error) {
	return s.repo.FindByEventID(ctx, eventID)
}
