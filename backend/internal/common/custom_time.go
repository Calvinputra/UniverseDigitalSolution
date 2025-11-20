package common

import (
    "time"
    "fmt"
    "strings"
)

type CustomTime struct {
    time.Time
}

const LayoutDatetimeLocal = "2006-01-02T15:04"

func (ct *CustomTime) UnmarshalJSON(b []byte) error {
    s := strings.Trim(string(b), "\"")

    t, err := time.Parse(LayoutDatetimeLocal, s)
    if err != nil {
        return fmt.Errorf("invalid datetime format: %v", err)
    }

    ct.Time = t
    return nil
}
