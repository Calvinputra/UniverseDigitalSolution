package config

import (
	"log"
	"os"
	"time"
)

type AuthConfig struct {
	JWTSecret     string
	TokenLifetime time.Duration
}

func LoadAuthConfig() AuthConfig {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET is not set in environment")
	}
	return AuthConfig{
		JWTSecret:     secret,
		TokenLifetime: 24 * time.Hour,
	}
}
