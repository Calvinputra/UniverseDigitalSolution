package attendance

import (
	"time"
)
type Attendance struct {
    ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
    EventID      int64     `gorm:"not null;index" json:"event_id"`
    FullName     string    `gorm:"not null" json:"full_name"`
    Email        string    `gorm:"not null;index" json:"email"`
    Status       string    `json:"status"`
    RegisteredAt time.Time `gorm:"autoCreateTime" json:"registered_at"`
}
