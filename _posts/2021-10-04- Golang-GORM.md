---
layout: article
title: Go에서 GORM를 사용해서 ORM 다루기
date: 2021.10.08 
image: 
tags: Go, DataBase
---
안녕하세요! Go에서 손쉽게 ORM를 할 수 있는 패키지인 [**GORM**](https://gorm.io/)에 대해서도 다루어 보겠습니다.  
많은 시간을 DB 설정에 투자하지 않고 획기적으로 Go를 이용하여서 DB를 관리하는 방법에 대해서 이야기 해 보겠습니다.

## What is ORM(Object-Relational Mapping)
ORM은 무엇일까요? 단순하게 포현하자면 객체와 관계와의 설정이라고 할 수 있습니다.  
객체와 관계형 데이터베이스의 데이터를 자동으로 Mapping(연결)해 주는 것을 말합니다.  
객체 지향 프로그래밍에서는 클래스를 사용하게 되고, 관계형 데이터베이스는 테이블을 사용하게 됩니다.  
ORM의 경우에는 객체 간의 관계를 바탕으로 SQL을 자동으로 생성하여서 불일치를 해결해 줍니다.

## Go에서는 왜 GORM를 써야할까?
일단 제가 생각하는 문제점은 Go에서 MySQL 등을 사용하여서 DataBase에 접속하기 위해서 작성되는 코드의 양도 줄어들 뿐만 아니라 프로젝트를 새로 만들 경우에도 직접 DataBase의 SQL를 통해 DataBase를 만들고 Table를 만들 필요도 없이 Go 코드로 구조를 만들고 코드를 실행 시켜 주기만 하면 DB에 Table이 만들어집니다.  
이보다 편하게 사용할 수는 없는 것 같습니다. 저도 최근에 개인적으로 토이 프로젝트를 하다가 알게 되었는데...! 신세계... 그 자체인 것 같습니다.

## 그럼 본격적으로 Go에서 ORM를 사용해 보기
GORM 패키지를 설치해 주어야 합니다.
```shell
$ go get -u gorm.io/gorm
$ go get -u gorm.io/driver/mysql
```
위 두 명령어를 통해서 GORM 패키지를 손쉽게 설치할 수 있습니다.  
이제 간단한게 MySQL이나 PostgreSQL 등 DataBase에 접속하여서 DataBase, Table 등을 만들어 보겠습니다.  

### 구조 정의
![Diagram](/assets/posts/go-gorm/how.png)

간단하게 그려 보았습니다. 모든 코드는 내부에서 동작하며 각기 다른 패키지 이름을 가지고 있으며, `Package main`기반으로 돌아가며 내부에서 패키지를 불러와서 실행시킵니다.  

```go
package model

import "github.com/jinzhu/gorm"

type Product struct {
	gorm.Model
	Title       string `gorm:"not null" json:"title"`
	Description string `gorm:"not null" json:"description"`
	Amount      int    `gorm:"not null" json:"amount"`
}
```
간단하게 위와 같이 Struct를 정의 시켜주면 됩니다. `gorm Model`를 통해서 GORM를 사용한다고 생각하시면 됩니다!  

### GORM + MYSQL Connection
```go
func ConnectDB() {
	var err error
	dsn := "user:pass@tcp(127.0.0.1:3306)/dbname"
	DB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to Connect DataBase")
	}

	color.Green("Connection Opened to Database...Success!")
	DB.AutoMigrate(&model.User{}, &model.Card{})
	color.Green("Database Migrated...Success!")
}
```
dsn 변수로 데이터베이스와 연결할 수 있는 코드를 설정하시면 됩니다.  
또한 DataBase 테이블이 자동적으로 만들어질 수 있도록 AutoMigrate에서 정의한 구조들을 가지고 오시면 됩니다!  
그럼 기본적으로 ORM을 사용할 수 있게 되었습니다!  
GORM을 가지고 프로젝트를 더 진행하고 싶으시다면 [GORM Docs](https://gorm.io/docs/index.html)를 읽어보시면 좋겠습니다.  
그럼 추후에 더 좋은 글로 찾아 뵙겠습니다! 감사합니다.