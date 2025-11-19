package event

import (
	"time"
	"backend/internal/user"
)

type Event struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string    `gorm:"size:200" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Location    string    `gorm:"size:200" json:"location"`
	Quota       int       `json:"quota"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`

	CreatedBy int64     `json:"created_by"`
	Creator   user.User `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
