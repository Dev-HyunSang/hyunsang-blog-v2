---
emoji: 🧑🏻‍💻
title: "crypto/bcrypt: hashedPassword is not the hash of the given password 관련 오류 해결 방법"
date: '2022-12-11'
author: HyunSang Park
tags: ["Golang", "Error"]
categories: Golang
---
안녕하세요. 박현상입니다.  
요즘 새로운 프로젝트를 하며 다양한 기술들을 다시 공부하고 있습니다.  
다른 서비스를 보며, 클론 코딩을 하면서 기술, 기능들에 대해서 다시 공부하고 있습니다.  

## 오류 상황
```go
type User struct {
	UserUUID     uuid.UUID `json:"user_uuid"`
	UserEmail    string    `json:"user_email"`
	UserPassword string    `json:"user_passoword"`
	UserNickname string    `json:"user_nickname"`
	UpdatedAt    time.Time `json:"updated_at"`
	CreatedAt    time.Time `json:"created_at"`
}
```

```go
// func JoinUser(c *fiber.Ctx) error
req := new(models.User)
if err := c.BodyParser(req); err != nil {
	panic(err)
}

userUUID := uuid.New()
pwHash, _ := bcrypt.GenerateFromPassword([]byte(req.UserPassword), 10)

userData := models.User{
	UserUUID:     userUUID,
	UserEmail:    req.UserEmail,
	UserPassword: string(pwHash),
	UserNickname: req.UserNickname,
	UpdatedAt:    time.Now(),
	CreatedAt:    time.Now(),
}
```
위 코드처럼 개발되어 있었으며, 유저 구조체(`models.User`)를 통해서 요청을 받으며, 그 구조체를 다시 이용하여 데이터베이스에 Insert(삽입)하고 있습니다.  

```shell
2022/12/11 16:14:29 $2a$10$td92eC4MJRgE0p0dVvEyFeMzacjKCOq0TQrrsrHELj0Pg/kLtnabu
2022/12/11 16:14:29 $2a$10$F/vHq7LcC.5MK9K79zO6a.dldOrNN3GVE8g2GEP.KBqb/cD0ksQwm
2022/12/11 16:14:29 crypto/bcrypt: hashedPassword is not the hash of the given password
```

```go
// func LoginUser(c *fiber.Ctx) error
req := new(models.RequestLogin) // 회원가입과 로그인 요청 구조체 다름.
if err := c.BodyParser(req); err != nil {
	panic(err)
}

userData, err := database.SearchingUserInfo(req.UserEmail)
if err != nil {
	return c.Status(fiber.StatusBadRequest).JSON(models.ErrResp{
		Code:        "error",
		StatusCode:  fiber.StatusBadRequest,
		Success:     false,
		Message:     "입력해 주신 메일 또는 패스워드를 찾을 수 없어요. 확인 후 다시 시도해 주세요.",
		ErrMessage:  err,
		RespondedAt: time.Now(),
	})
}

if err = bcrypt.CompareHashAndPassword([]byte(userData.UserPassword), []byte(req.UserPassword)); err != nil {
	log.Println(err)
	return c.Status(fiber.StatusBadRequest).JSON(models.ErrResp{
		Code:        "error",
		StatusCode:  fiber.StatusBadRequest,
		Success:     false,
		Message:     "입력해 주신 메일 또는 패스워드를 찾을 수 없어요. 확인 후 다시 시도해 주세요.",
		ErrMessage:  err,
		RespondedAt: time.Now(),
	})
}
```

`crypto/bcrypt: hashedPassword is not the hash of the given password`라는 오류가 발생하게 되며, 위와 같이 암호화는 제대로 되지만 복호화가 되지 않는 오류가 발생하게 되었습니다. 또한 동일한 값으로 암호화하여 데이터베이스와 코드 상에서 암호화하여 표출하는 경우 암호화된 값이 다르다는 점을 알게 되었습니다. 또한 로그인과 회원가입 시 요청을 받는 구조체가 다르다는 점을 알게 되었습니다.  
이로 인해서 구조체 관련 오류 사항인지 확인했습니다. **확인 후 구조체 때문에 오류가 발생한다는 사실을 알게 되었습니다.**

## 해결 방법
구조체를 사용할 때 필요한 요청만 담고 있는 구조체를 사용해야 한다는 사실을 알게 되었습니다. 안 그러면 서로 값이 달라져서 오류가 발생하게 됩니다.

```go
type RequestJoin struct {
	UserEmail    string `json:"user_email"`
	UserPassword string `json:"user_password"`
	UserNickname string `json:"user_nickname"`
}

type RequestLogin struct {
	UserEmail    string `json:"user_email"`
	UserPassword string `json:"user_password"`
}
```

로그인과 회원가입의 요청을 받을 수 있는 구조체를 생성하였고 따로따로 생성하였습니다.
