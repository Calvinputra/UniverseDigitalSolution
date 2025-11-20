package attendance

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, a *Attendance) error
	FindByEventID(ctx context.Context, eventID int64) ([]Attendance, error)
   	FindByEventAndEmail(ctx context.Context, eventID int64, email string) (*Attendance, error)
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
		Where("event_id = ?", eventID).
		Order("registered_at ASC").
		Find(&list).Error

	return list, err
}

func (r *repository) FindByEventAndEmail(ctx context.Context, eventID int64, email string) (*Attendance, error) {
    var att Attendance
    if err := r.db.WithContext(ctx).
        Where("event_id = ? AND email = ?", eventID, email).
        First(&att).Error; err != nil {
        return nil, err
    }
    return &att, nil
}
