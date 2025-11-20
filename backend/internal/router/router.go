package router

import (
	"backend/internal/attendance"
	"backend/internal/config"
	"backend/internal/event"
	"backend/internal/middleware"
	"backend/internal/user"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
    "time"  
)

func SetupRouter(db *gorm.DB, authCfg config.AuthConfig) *gin.Engine {
	// Prod
	// r := gin.New()
	// Development
	r := gin.Default()
	r.Use(gin.Logger(), gin.Recovery())

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://72.61.208.85",
		},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

	jwtManager := user.NewJWTManager(authCfg)

	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo, jwtManager)
	userHandler := user.NewHandler(userService)

	eventRepo := event.NewRepository(db)
	eventService := event.NewService(eventRepo)
	eventHandler := event.NewHandler(eventService)

	attendanceRepo := attendance.NewRepository(db)
	attendanceService := attendance.NewService(attendanceRepo)
	attendanceHandler := attendance.NewHandler(attendanceService)

	api := r.Group("/api/v1")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.GET("/events", eventHandler.GetEvents)
		api.GET("/events/:id", eventHandler.GetEventDetail)
		api.POST("/events/:id/attend", attendanceHandler.Attend)
		api.GET("/events/:id/attendances", attendanceHandler.ListByEvent)

		auth := api.Group("/")
		auth.Use(middleware.AuthRequired(jwtManager))
		{
			auth.POST("/events", eventHandler.CreateEvent)
		    auth.POST("/events/new", eventHandler.CreateEvent)   
		}
	}


	return r
}
