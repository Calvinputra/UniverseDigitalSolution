package user

import "time"

type Role struct {
    ID          int64  `gorm:"primaryKey;autoIncrement" json:"id"`
    Name        string `gorm:"unique" json:"name"`
}

type User struct {
    ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
    Name         string    `json:"name"`
    Email        string    `gorm:"unique" json:"email"`
    PasswordHash string    `json:"-"`
    RoleID       int64     `json:"role_id"`
	RoleName 	 string    `json:"role_name" gorm:"-"`
    CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}
