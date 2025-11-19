package event

import (
    "time"
    "backend/internal/user"
)

type Event struct {
    ID          int64       `gorm:"primaryKey;autoIncrement" json:"id"`
    Title       string      `json:"title"`
    Description string      `json:"description"`
    Location    string      `json:"location"`
    Quota       int         `json:"quota"`
    StartTime   time.Time   `json:"start_time"`
    EndTime     time.Time   `json:"end_time"`
    CreatedBy   int64       `json:"created_by"`
    Creator     user.User   `gorm:"foreignKey:CreatedBy" json:"creator"`
    CreatedAt   time.Time   `gorm:"autoCreateTime" json:"created_at"`
}
