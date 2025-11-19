package response

import "github.com/gin-gonic/gin"

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

func Success(c *gin.Context, code int, data interface{}) {
	c.JSON(code, APIResponse{
		Success: true,
		Data:    data,
	})
}

func Fail(c *gin.Context, code int, message string, err interface{}) {
	c.JSON(code, APIResponse{
		Success: false,
		Message: message,
		Error:   err,
	})
}
