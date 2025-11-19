package event

import "gorm.io/gorm"

type Repository interface {
	FindAll() ([]Event, error)
	FindByID(id int64) (*Event, error)
	Create(e *Event) error
	Update(e *Event) error
	Delete(id int64) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (repo *repository) FindAll() ([]Event, error) {
	var events []Event
	err := repo.db.Preload("Creator").
		Order("start_time ASC").
		Find(&events).Error
	return events, err
}

func (repo *repository) FindByID(id int64) (*Event, error) {
	var event Event
	err := repo.db.Preload("Creator").
		First(&event, id).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (repo *repository) Create(e *Event) error {
	return repo.db.Create(e).Error
}

func (repo *repository) Update(e *Event) error {
	return repo.db.Save(e).Error
}

func (repo *repository) Delete(id int64) error {
	return repo.db.Delete(&Event{}, id).Error
}
