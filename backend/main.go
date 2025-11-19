package main

import (
    "backend/internal/event"
    "backend/internal/user"
    "backend/internal/attendance"

)

func main() {
    db := config.InitDB()

    db.AutoMigrate(
        &user.User{},
        &user.Role{},
        &event.Event{},
        &attendance.Attendance{},
    )

    r := router.SetupRouter(db)
    r.Run(":8080")
}
