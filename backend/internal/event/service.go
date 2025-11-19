package event

import (
	"context"
	"errors"
	"time"
)

type Service interface {
	FindAll(ctx context.Context) ([]Event, error)
	FindByID(ctx context.Context, id int64) (*Event, error)
	Create(ctx context.Context, input CreateEventInput, userID int64) (*Event, error)
	Delete(ctx context.Context, id int64, userID int64) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

type CreateEventInput struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	Quota       int       `json:"quota"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
}

func (s *service) FindAll(ctx context.Context) ([]Event, error) {
	return s.repo.FindAll(ctx)
}

func (s *service) FindByID(ctx context.Context, id int64) (*Event, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *service) Create(ctx context.Context, input CreateEventInput, userID int64) (*Event, error) {
	event := Event{
		Title:       input.Title,
		Description: input.Description,
		Location:    input.Location,
		Quota:       input.Quota,
		StartTime:   input.StartTime,
		EndTime:     input.EndTime,
		CreatedBy:   userID,
	}

	if err := s.repo.Create(ctx, &event); err != nil {
		return nil, err
	}
	return &event, nil
}

func (s *service) Delete(ctx context.Context, id int64, userID int64) error {
	event, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if event.CreatedBy != userID {
		return errors.New("you are not the owner of this event")
	}

	return s.repo.Delete(ctx, id)
}
