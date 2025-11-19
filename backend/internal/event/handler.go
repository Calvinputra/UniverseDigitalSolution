package event

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"backend/pkg/response"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetEvents(c *gin.Context) {

	events, err := h.service.FindAll(c.Request.Context())
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "failed to fetch events", err.Error())
		return
	}

	response.Success(c, http.StatusOK, events)
}

func (h *Handler) GetEventDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Fail(c, http.StatusBadRequest, "invalid event id", err.Error())
		return
	}

	event, err := h.service.FindByID(c.Request.Context(), id)
	if err != nil {
		response.Fail(c, http.StatusNotFound, "event not found", err.Error())
		return
	}

	response.Success(c, http.StatusOK, event)
}

func (h *Handler) CreateEvent(c *gin.Context) {
	var input CreateEventInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Fail(c, http.StatusBadRequest, "invalid request body", err.Error())
		return
	}

	userIDValue, ok := c.Get("user_id")
	if !ok {
		response.Fail(c, http.StatusUnauthorized, "unauthorized", "missing user id in context")
		return
	}
	userID := userIDValue.(int64)

	event, err := h.service.Create(c.Request.Context(), input, userID)
	if err != nil {
		response.Fail(c, http.StatusInternalServerError, "failed to create event", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, event)
}

func (h *Handler) DeleteEvent(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Fail(c, http.StatusBadRequest, "invalid event id", err.Error())
		return
	}

	userIDValue, ok := c.Get("user_id")
	if !ok {
		response.Fail(c, http.StatusUnauthorized, "unauthorized", "missing user id in context")
		return
	}
	userID := userIDValue.(int64)

	err = h.service.Delete(c.Request.Context(), id, userID)
	if err != nil {
		response.Fail(c, http.StatusForbidden, "failed to delete", err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{"deleted": id})
}
