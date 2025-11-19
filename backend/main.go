package main

import (
	"log"

	"backend/internal/config"
	"backend/internal/migrate"
	"backend/internal/router"
)

func main() {
	db, err := config.NewDB()
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	if err := migrate.AutoMigrate(db); err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}

	authCfg := config.LoadAuthConfig()

	r := router.SetupRouter(db, authCfg)
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
