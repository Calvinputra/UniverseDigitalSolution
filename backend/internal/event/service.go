package event

import (
	"time"
)

type Service interface {
    FindAll() ([]Event, error)
    FindByID(id int64) (*Event, error)
    Create(input CreateEventInput) (*Event, error)
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo: repo}
}

type CreateEventInput struct {
    Title       string
    Description string
    Location    string
    Quota       int
    StartTime   time.Time
    EndTime     time.Time
    CreatedBy   int64
}

func (s *service) FindAll() ([]Event, error) {
    return s.repo.FindAll()
}

func (s *service) FindByID(id int64) (*Event, error) {
    return s.repo.FindByID(id)
}

func (s *service) Create(input CreateEventInput) (*Event, error) {
    event := Event{
        Title:       input.Title,
        Description: input.Description,
        Location:    input.Location,
        Quota:       input.Quota,
        StartTime:   input.StartTime,
        EndTime:     input.EndTime,
        CreatedBy:   input.CreatedBy,
    }

    err := s.repo.Create(&event)
    if err != nil {
        return nil, err
    }

    return &event, nil
}
