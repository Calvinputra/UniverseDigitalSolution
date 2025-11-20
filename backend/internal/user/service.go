package user

import (
    "context"
    "errors"
)

var ErrEmailAlreadyInUse = errors.New("email already in use")

type Service interface {
    Register(ctx context.Context, input RegisterInput) (*User, error)
    Login(ctx context.Context, input LoginInput) (string, *User, error)
}

type service struct {
    repo       Repository
    jwtManager *JWTManager
}

func NewService(repo Repository, jwtManager *JWTManager) Service {
    return &service{repo: repo, jwtManager: jwtManager}
}

type RegisterInput struct {
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

type LoginInput struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

func (s *service) Register(ctx context.Context, input RegisterInput) (*User, error) {
    existing, err := s.repo.FindByEmail(ctx, input.Email)
    if err != nil {
    }
    if existing != nil && existing.ID != 0 {
        return nil, ErrEmailAlreadyInUse
    }

    hashed, err := HashPassword(input.Password)
    if err != nil {
        return nil, err
    }

    user := &User{
        Name:         input.Name,
        Email:        input.Email,
        PasswordHash: hashed,
        RoleID:       1,
    }

    if err := s.repo.Create(ctx, user); err != nil {
        return nil, err
    }

    return user, nil
}

func (s *service) Login(ctx context.Context, input LoginInput) (string, *User, error) {
    user, err := s.repo.FindByEmail(ctx, input.Email)
    if err != nil {
        return "", nil, errors.New("invalid email or password")
    }

    if !CheckPassword(user.PasswordHash, input.Password) {
        return "", nil, errors.New("invalid email or password")
    }

    token, err := s.jwtManager.Generate(user.ID)
    if err != nil {
        return "", nil, err
    }

    return token, user, nil
}
