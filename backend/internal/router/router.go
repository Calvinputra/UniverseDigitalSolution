package router

import (

	"strings"
	"time"

	"backend/internal/attendance"
	"backend/internal/config"
	"backend/internal/event"
	"backend/internal/middleware"
	"backend/internal/user"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, authCfg config.AuthConfig) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

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

		r.Use(cors.New(cors.Config{
				AllowOrigins: []string{
					"http://localhost:5173",
					"http://72.61.208.85:8080",
				},
				AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
				AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
				ExposeHeaders:    []string{"Content-Length"},
				AllowCredentials: true,
				MaxAge:           12 * time.Hour,
			}))

			frontendDir := "/root/UniverseDigitalSolution/frontend/dist"

			r.Static("/assets", frontendDir+"/assets")

			r.GET("/", func(c *gin.Context) {
				c.File(frontendDir + "/index.html")
			})

			r.NoRoute(func(c *gin.Context) {
				path := c.Request.URL.Path

				if strings.HasPrefix(path, "/api/") {
					c.JSON(404, gin.H{"message": "not found"})
					return
				}

				c.File(frontendDir + "/index.html")
			})

			return r
		}
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.GET("/events", eventHandler.GetEvents)
		api.GET("/events/:id", eventHandler.GetEventDetail)

		auth := api.Group("/")
		auth.Use(middleware.AuthRequired(jwtManager))
		{
			auth.POST("/events", eventHandler.CreateEvent)
			auth.DELETE("/events/:id", eventHandler.DeleteEvent)

			auth.POST("/events/:id/attend", attendanceHandler.Attend)
			auth.GET("/events/:id/attendances", attendanceHandler.ListByEvent)
		}
	}

	return r
}
