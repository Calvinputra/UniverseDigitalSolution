package attendance

import (
	"time"
	"backend/internal/user"
)

type Attendance struct {
	ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	EventID      int64     `json:"event_id"`
	UserID       int64     `json:"user_id"`
	Status       string    `gorm:"size:50" json:"status"`
	RegisteredAt time.Time `gorm:"autoCreateTime" json:"registered_at"`

	User user.User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}
