package user

import "time"

type Role struct {
	ID   int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"unique;size:50" json:"name"`
}

type User struct {
	ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string    `gorm:"size:100" json:"name"`
	Email        string    `gorm:"unique;size:100" json:"email"`
	PasswordHash string    `json:"-"`
	RoleID       int64     `json:"role_id"`
	Role         Role      `gorm:"foreignKey:RoleID" json:"role,omitempty"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}
