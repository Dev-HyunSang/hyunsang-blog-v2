---
emoji: 🔐
title: "Go언어와 JWT(JSON Web Token)을 함께 사용하면서\n Redis를 통해서 더 안전하게 사용하기!"
date: '2023-02-15'
author: HyunSang Park
tags: ["Golang", "Security"]
categories: Golang
---
안녕하세요. 오늘은 Go언어와 함께 JWT(JSON Web Token)을 사용하는 방법과 함께 JWT의 취약점을 Redis를 통해서 안전하게 사용할 수 있는 방법에 대해서 이야기 해 보고자 합니다.

## JWT(JSON Web Token)이란?
JWT(JSON Web Token)는 유저를 인증하고 식별하기 위한 토큰 기반의 인증입니다. RFC 7519에 자세한 명세가 나왔습니다.  
토큰은 세션과 달리 서버가 아닌 클라이언트에 저장이 되기에, 메모리나 스토리지 등을 통해서 세션을 관리했던 서버의 부담을 덜 수 있습니다. 세션의 이러한 단점을 JWT를 통해서 보완할 수 있지만 JWT는 토큰 자체에 사용자의 권한 정보나 서비스를 사용하기 위한 정보가 포함(Self-contained)된다는 것이다. 데이터가 많아지면 토큰이 커질 수 있으며 토큰이 한 번 발급된 이후 사용자의 정보를 바꾸더라도 토큰을 재발급하지 않는 이상 반영되지 않습니다.  

**일반적으로 JWT를 사용하면 아래와 같은 순서로 진행됩니다.**  
1. 클라이언트 사용자가 아이디(혹은 메일), 패스워드를 통해서 웹 서비스에서 인증을 받습니다.
2. 서버에서 서명된(Signed) JWT를 생성하여 클라이언트로 응답을 돌려줍니다.
3. 클라이언트가 서버에 데이터를 추가적으로 요구할 때마다 JWT를 HTTP Header에 첨부하여 요청합니다.
4. 서버에서 클라이언트로부터 온 JWT를 검증합니다.

JWT는 JSON 데이터를 Base64 URL Safe Encode를 통해 인코딩하여 직렬화한 것이 포함되며 토큰 내부에는 위변조 방지를 위해 개인키를 통한 전자서명도 있습니다. 따라서 사용자가 JWT를 서버로 전송하면 서버는 서명을 검증하는 과정을 거치게 되며 검증이 완료되면 요청한 응답을 돌려줍니다.  

## Access Token과 Refresh Token
- **Access Token:** 접근을 관여하는 토큰
- **Refresh Token:** 재발급에 관여하는 토큰
JWT의 단점은 발급한 후, 삭제가 불가능하기 때문에 접근에 관여하는 토큰은 유효시간을 길게 부여할 수 없습니다.  
사용자 이용의 불편함이 없기 위해서 자동 로그인 혹은 로그인 유지를 위해서는 유효기간이 긴 토큰이 필요하게 됩니다.  
이때 사용할 수 있는 토큰은 Refresh Token입니다.  

**Access Token 재발급은 크게 2가지 방법으로 볼 수 있습니다.**  
- 요청마다 Access Token과 Refresh Token을 같이 넘기는 방법.
- 재발급 API를 만들고 서버에서 Access Token이 만료되었다고 응답하면 Refresh Token으로 요청하여 재발급 받기.

### 생명주기
제가 생각하기론 JWT의 취약점이자 다점인 생명 주기입니다.  
Access Token을 먼저 봐 보겠습니다. Access Token은 발급된 이후, 서버에 저장되지 않고 토큰 자체로 검증을 하면서 사용자에게 권한을 인증하게 됩니다.  
이러한 중요한 권한은 담당하고 있는 Access Token이 탈취된다면 토큰이 만료되기 전까지 토큰을 획득한 사람은 누구나 권한 접근이 가능해지게 됩니다. 따라서 보안을 위해서는 Access Token의 유효 주기는 짧게 가져야합니다. 그러면 우리는 여기서 문득 네이버나 인스타그램, 페이스북 등에서 볼 수 있는 자동 로그인 혹은 로그인 유지에 대해서 궁금증이 생기게 됩니다.  
Refresh Token은 한 번 발급되면 Access Token보다 훨씬 길게 발급됩니다. 대신에 접근에 대한 권한을 주는 것이 아니라 Access Toen 재발급에만 관여하고 있습니다.

## Go언어 프로젝트 설정하기
```shell
$ go get -u github.com/gofiber/fiber/v2
$ go run -mod=mod entgo.io/ent/cmd/ent new User 
$ go get -u github.com/golang-jwt/jwt/v4
$ go get -u github.com/redis/go-redis/v9

```
`golang-jwt/jwt/v4`을 설치하시면 JWT(JSON Web Token)을 발행할 수 있습니다.
저는 ATK 재발급을 위해서 Redis 저장소(DBMS)를 사용합니다.  
Key-Value 형식으로 저장됩니다. 저는 `user_uuid-RTK` 형식으로 저장하고 있습니다.

### Redis in Docker
```shell
$ docker run --name redis-jwt -p 6379:6379 -d redis
```

## Access Token의 재발급 방법 - Redis 이용
어떻게 Access Token을 재발급할 수 있는지에 대해서 이야기해 보겠습니다.  
Refresh Token은 로그인 성공 시 발급되며 저장소에 저장하여 관리됩니다. 사용자가 로그아웃을 하면 저장소에서 Refresh Token을 삭제하여 사용이 불가능하도록 합니다.

### Redis 접속하기
```go
func RedisInit() *redis.Client {
	dsn := config.GetEnv("REDIS_ADDR")
	if len(dsn) == 0 {
		log.Panic("Redis와 관련된 필수적인 환경변수를 찾을 수 없네요.")
	}

	client := redis.NewClient(&redis.Options{
		Addr: dsn,
	})

	return client
}
```
Redis의 접속할 수 있는 기능입니다. `.env` 파일에서 Redis의 접속할 주소를 불러옵니다. 통상적으로 Redis의 접속 주소는 `localhost:6379`을 사용합니다.
만약 `.env` 파일에서 `REDIS_ADDR`가 없는 경우 환경변수의 값을 찾을 수 없다고 오류로 실행을 할 수 없도록 합니다.

### 새로운 Acess · Refresh Token 발급하기
```go
func CreateJWT(userUUID uuid.UUID) (*models.TokenDetails, error) {
	td := new(models.TokenDetails)
	var err error // 구조체를 사용하기 때문에 따로 지정함.

	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUUID = uuid.New()
	td.UserUUID = userUUID

	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUUID = uuid.New()

	key := config.GetEnv("ACCESS_SECRET")
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["user_uuid"] = td.UserUUID
	atClaims["access_uuid"] = td.AccessUUID
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(key))
	if err != nil {
		return nil, err
	}

	ref := config.GetEnv("REFRESH_SECRET")
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUUID
	rtClaims["user_uuid"] = td.UserUUID
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(ref))
	if err != nil {
		return nil, err
	}

	return td, nil
}
```
- `Access Token`은 15분의 제한이 있으며, `Refresh Token`는 1주일 동안의 제한 시간이 있습니다.  
- `Access Token`의 포함된 정보는 접근이 가능한지, 발급 받는 사용자의 UUID, Access Token마다의 고유한 UUID, 만료일시는 15분을 가지고 있습니다.
    - 암호화 알고리즘인 `HS256`를 페이로드를 암호화 합니다.
- `Refresh Token`의 포함된 정보는 Refresh Token마다의 고유한 UUID, 그리고 Refresh Token를 발급 받는 사용자의 UUID, 만료일시는 1주일을 가지고 있습니다.
    - 암호화 알고리즘인 `HS256`를 페이로드를 암호화 합니다.
- **새롭게 발급 받은 Access · Refresh Token을 구조체로 저장합니다.**

### 발급한 토큰을 Redis 저장하기
```go
func InsertRedisAuth(userUUID uuid.UUID, td *models.TokenDetails) error {
	at := time.Unix(td.AtExpires, 0)
	rt := time.Unix(td.RtExpires, 0)

	client := RedisInit()
	err := client.Set(context.Background(), td.AccessUUID.String(), userUUID.String(), at.Sub(time.Now())).Err()
	if err != nil {
		return err
	}
	err = client.Set(context.Background(), td.RefreshUUID.String(), userUUID.String(), rt.Sub(time.Now())).Err()
	if err != nil {
		return err
	}
	return nil
}
```
- 사용자마다 UUID와 토큰을 저장한 구조체를 불러와서 Redis에 저장할 수 있도록 합니다.
- Access · Refresh Token 발급할 때 사용한 UUID와 발급받은 사용자의 UUID를 Redis으로 저장합니다.
- 오류 발생 시 오류를 반환합니다.

### Redis에 저장되어 있는 정보를 불러오기
```go
// auth/verify.go
func ExtractToken(r *fiber.Ctx) (string, error) {
	bearToken := r.GetReqHeaders()

	jwtString := strings.Split(bearToken["Authorization"], "Bearer ")[1]
	if len(jwtString) == 0 { // 만약 토큰 없는 경우 오류 반환함.
		return "", errors.New("Failed to Reading JSON Web Token.")
	}

	return jwtString, nil
}

func VerifyToken(r *fiber.Ctx) (*jwt.Token, error) {
	tokenString, err := ExtractToken(r)
	if err != nil {
		return nil, err
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetEnv("ACCESS_SECRET")), nil
	})

	return token, err
}

// auth/auth.go
func FetchAuth(authD *models.AccessDetails) (string, error) {
	client := RedisInit()

	result, err := client.Get(context.Background(), authD.AccessUUID).Result()

	return result, err
}

func ExtractTokenMetaData(r *fiber.Ctx) (*models.AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)

	if ok && token.Valid {
		accessUUID, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, nil
		}

		userUUID, ok := claims["user_uuid"].(string)
		if !ok {
			return nil, nil
		}

		// 구조체 관련 오류 발생으로 인해서 검증이 되지 않았음.
		return &models.AccessDetails{
			AccessUUID: accessUUID,
			UserUUID:   userUUID,
		}, nil
	}
	return nil, err
}
```
- **`auth/verfiy.go`의 `ExtractToken()`의 함수에 대한 리뷰**
    - 사용자의 요청을 받을 때 HTTP Header 내부에 함께 요청된 토큰을 불러옵니다.
        - 만약 사용자가 토큰이 없는 상태에서 요청을 보낸 경우, 401 Unauthorized으로 응답을 보냅니다.
    - HTTP Header에 포함된 토큰이 `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6ImNkNGJhMTcyLTRhZWMtNGVmYi1hNWNmLTZiZWVmZjVjYzk5OCIsImF1dGhvcml6ZWQiOnRydWUsImV4cCI6MTY3NTA2NjMzNiwidXNlcl91dWlkIjoiOTkzNjBmNzktMWJlZi00NzdmLTg2MzgtZWU0MTI3ZGZhYjE3In0.G5iW0m2SL4mMHZR13TAy-7It4gDAeVidcYoC5fc1vwc` 형식으로 오게 되는데 `Bearer`을 제거하고 토큰만 남길 수 있도록 가공하여서 넘깁니다.
- **`auth/verify.go`의 `VerifyToken()` 함수에 대한 리뷰**
    - `ExtractToken()`에서 가공된 토큰을 JWT 토큰이 정상적인지 확인하는 체크합니다. 정상적이면 토큰을 반환합니다.
- **`auth/auth.go`의 `FetchAuth()` 함수에 대한 리뷰**
    - Access UUID를 통해서 Redis에 저장되어 있는 정보를 가지고 옵니다. 동일한 정보가 있는 경우 반환하며, 오류 혹은 정보가 없는 경우 반환합니다.


## 참고한 글
- [[Lib] GO언어에서 JWT사용하기](https://www.vompressor.com/jwt-go/)
- [Redis를 통한 JWT Refresh Token 관리](https://sol-devlog.tistory.com/22)

--- 
<div align="right">
    <p style="color: #909090;">2023.02.15 ~ 작성 중</p>
</div>