package migrate

import (
	"backend/internal/attendance"
	"backend/internal/event"
	"backend/internal/user"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&user.Role{},
		&user.User{},
		&event.Event{},
		&attendance.Attendance{},
	)
}
