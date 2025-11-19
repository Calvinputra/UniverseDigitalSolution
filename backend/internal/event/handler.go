package event

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type Handler struct {
    service Service
}

func NewHandler(service Service) *Handler {
    return &Handler{service}
}

func (h *Handler) GetEvents(c *gin.Context) {
    events, err := h.service.FindAll()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": events})
}

func (h *Handler) GetEventByID(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.ParseInt(idParam, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    event, err := h.service.FindByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": event})
}

func (h *Handler) CreateEvent(c *gin.Context) {
    var input CreateEventInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    event, err := h.service.Create(input)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"data": event})
}
