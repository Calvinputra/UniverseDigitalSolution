package config

import (
    "log"

    "backend/internal/attendance"
    "backend/internal/event"
    "backend/internal/user"
    "gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {
    if err := db.AutoMigrate(
        &user.Role{},
        &user.User{},
        &event.Event{},
        &attendance.Attendance{},
    ); err != nil {
        log.Fatal("failed to migrate:", err)
    }
}
