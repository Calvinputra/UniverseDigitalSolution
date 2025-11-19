package router

import (
    "backend/internal/attendance"
    "backend/internal/event"
    "backend/internal/user"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
    r := gin.Default()

    userRepo := user.NewRepository(db)
    userService := user.NewService(userRepo)
    userHandler := user.NewHandler(userService)

    eventRepo := event.NewRepository(db)
    eventService := event.NewService(eventRepo)
    eventHandler := event.NewHandler(eventService)

    attendanceRepo := attendance.NewRepository(db)
    attendanceService := attendance.NewService(attendanceRepo)
    attendanceHandler := attendance.NewHandler(attendanceService)

    api := r.Group("/api")
    {
        api.POST("/register", userHandler.Register)
        api.POST("/login", userHandler.Login)

        api.GET("/events", eventHandler.GetEvents)
        api.POST("/events", eventHandler.CreateEvent)

        api.POST("/events/:id/attend", attendanceHandler.Attend)
        api.GET("/events/:id/attendances", attendanceHandler.ListByEvent)
    }

    return r
}
