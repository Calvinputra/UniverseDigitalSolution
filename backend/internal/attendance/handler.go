// backend/internal/attendance/handler.go
package attendance

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
    service Service
}

func NewHandler(service Service) *Handler {
    return &Handler{service: service}
}

func (h *Handler) Attend(c *gin.Context) {
    var input AttendInput

    eventIDStr := c.Param("id")
    eventID, err := strconv.ParseInt(eventIDStr, 10, 64)
    if err != nil {
        response.Fail(c, http.StatusBadRequest, "invalid event id", err.Error())
        return
    }
    input.EventID = eventID

    if err := c.ShouldBindJSON(&input); err != nil {
        log.Println("BIND ERROR =", err)
        response.Fail(c, http.StatusBadRequest, "input tidak valid", err.Error())
        return
    }

    record, err := h.service.Attend(c.Request.Context(), input)
    if errors.Is(err, ErrAlreadyRegistered) {
        response.Fail(c, http.StatusConflict, "email sudah terdaftar di event ini", err.Error())
        return
    }
    if err != nil {
        response.Fail(c, http.StatusInternalServerError, "failed to attend event", err.Error())
        return
    }

    response.Success(c, http.StatusCreated, record)
}

func (h *Handler) ListByEvent(c *gin.Context) {
    eventIDStr := c.Param("id")
    eventID, err := strconv.ParseInt(eventIDStr, 10, 64)
    if err != nil {
        response.Fail(c, http.StatusBadRequest, "invalid event id", err.Error())
        return
    }

    list, err := h.service.ListByEvent(c.Request.Context(), eventID)
    if err != nil {
        response.Fail(c, http.StatusInternalServerError, "failed to get attendances", err.Error())
        return
    }

    response.Success(c, http.StatusOK, list)
}
