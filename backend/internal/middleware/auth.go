package middleware

import (
	"net/http"
	"strings"

	"backend/internal/user"
	"backend/pkg/response"
	"github.com/gin-gonic/gin"
)

func AuthRequired(jwtManager *user.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			response.Fail(c, http.StatusUnauthorized, "missing or invalid Authorization header", nil)
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(header, "Bearer ")

		userID, err := jwtManager.Verify(tokenStr)
		if err != nil {
			response.Fail(c, http.StatusUnauthorized, "invalid or expired token", err.Error())
			c.Abort()
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}
