package attendance

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, a *Attendance) error
	FindByEventID(ctx context.Context, eventID int64) ([]Attendance, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Create(ctx context.Context, a *Attendance) error {
	return r.db.WithContext(ctx).Create(a).Error
}

func (r *repository) FindByEventID(ctx context.Context, eventID int64) ([]Attendance, error) {
	var list []Attendance
	err := r.db.WithContext(ctx).
		Preload("User").
		Where("event_id = ?", eventID).
		Find(&list).Error

	return list, err
}
