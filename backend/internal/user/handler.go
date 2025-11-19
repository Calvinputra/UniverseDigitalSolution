package user

import (
	"net/http"

	"backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Fail(c, http.StatusBadRequest, "invalid request body", err.Error())
		return
	}

	user, err := h.svc.Register(c.Request.Context(), input)
	if err != nil {
		response.Fail(c, http.StatusBadRequest, "failed to register", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, gin.H{
		"user": user,
	})
}

func (h *Handler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Fail(c, http.StatusBadRequest, "invalid request body", err.Error())
		return
	}

	token, user, err := h.svc.Login(c.Request.Context(), input)
	if err != nil {
		response.Fail(c, http.StatusUnauthorized, "login failed", err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}
