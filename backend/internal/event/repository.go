package event

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	FindAll(ctx context.Context) ([]Event, error)
	FindByID(ctx context.Context, id int64) (*Event, error)
	Create(ctx context.Context, e *Event) error
	Update(ctx context.Context, e *Event) error
	Delete(ctx context.Context, id int64) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindAll(ctx context.Context) ([]Event, error) {
	var events []Event
	err := r.db.
		WithContext(ctx).
		Preload("Creator").
		Order("start_time ASC").
		Find(&events).Error
	return events, err
}


func (r *repository) FindByID(ctx context.Context, id int64) (*Event, error) {
	var event Event
	err := r.db.
		WithContext(ctx).
		Preload("Creator").
		First(&event, id).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *repository) Create(ctx context.Context, e *Event) error {
	return r.db.WithContext(ctx).Create(e).Error
}

func (r *repository) Update(ctx context.Context, e *Event) error {
	return r.db.WithContext(ctx).Save(e).Error
}

func (r *repository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&Event{}, id).Error
}
