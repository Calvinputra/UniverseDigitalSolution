package user

import "gorm.io/gorm"

type Repository interface {
    Create(user *User) error
    FindByEmail(email string) (*User, error)
    FindByID(id uint) (*User, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (repo *repository) Create(user *User) error {
    return repo.db.Create(user).Error
}

func (repo *repository) FindByEmail(email string) (*User, error) {
    var user User
    err := repo.db.Where("email = ?", email).First(&user).Error
    return &user, err
}

func (repo *repository) FindByID(id uint) (*User, error) {
    var user User
    err := repo.db.First(&user, id).Error
    return &user, err
}
