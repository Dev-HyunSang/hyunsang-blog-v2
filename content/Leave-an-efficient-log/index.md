---
emoji: 🧑🏻‍💻
title:  Go언어에서 효율적인 로그 남기기
date: '2021-12-17'
author: HyunSang Park
tags: ["Golang", "Programming"]
categories: Golang
---
안녕하세요. 요즘 회사에서 미디어 스토리지를 개발 하면서 드는 생각이 있습니다.  
실제로 돌아가고 있는 서비스나 시스템에서는 로그를 어떻게 관리하며, 로그의 중요성을 파악하고 있습니다.  
로그 시스템이 추후에 데이터 자산이 될 수도 있다는 생각과 더불어 추후에 개발을 하면서 어떻게 동작하고 어떤 오류가 있는지 명확하게 파악할 수 있다는 생각이 들어서 효율적으로 Go언어를 통해서 로그를 어떻게 남기면 좋을지에 대해서 이야기 해 보고자 합니다. 다소 부족하지만 읽어주시면 감사하겠습니다!  

## Go언어에서 사용할 수 있는 Logger는?
Go언어에서 기본적으로 제공해 주는 Logger인 `log`가 있습니다. 기존적으로 제공되는 패키지는 몇 가지의 단점이 있어서 그러한 부족한 점들을 채우기 위해서 외부 Logger를 사용하시는 것을 추천드립니다.  
찾아보고 많이 알아보니 다양한 Logger들이 있는데 개인 취향이나 서비스(시스템)에 더 좋은 패키지를 사용한 것 같아서 정리해 봅니다.

- [`golang/gloag`](https://github.com/golang/glog)
- [`uber-go/zap`](https://github.com/uber-go/zap)
- [`rs/zerolog`](https://github.com/rs/zerolog)

JSON 형식으로 출력되는 패키지도 있으며, 텍스트 형식으로 출력이 가능한 패키지들이 있습니다.  
개발하는 방향에 따라서 사용하시면 될 것 같습니다. **이 글에서는 [`uber-go/zap`](https://github.com/uber-go/zap)을 사용할 예정입니다.**

## Logger를 사용, 개발할 때 고려해야할 상황
개발을 하면서 몇 개의 주의점과 기존 패키지의 단점들, 몇 가지를 알면 좋을 팁들을 전해 드리고자 합니다...! 

### 기존의 문제점 해결하기
Go언어에서 기본적으로 log 패키지를 지원 하지만 정확한 caller를 확인할 수 없다는 단점이 있습니다.  
기존의 log 패키지를 사용할 경우에는 `logger/logger:42`와 같이 출력되어서 한 계층 위의 Caller 알 수 없다는 단점이 있었습니다.  
그런 단점들을 보완할 수 있는 방법은 기본 패키지를 사용하지 않고 외부 패키지를 사용하여서 logger를 개발하는 방법이 더 좋은 선택일 수 있습니다.

### 로그 파일의 저정과 용량 문제
로그를 `.log`나 다른 파일들로 저장을 하였을 때 로컬에 저장하는 경우 용량의 범람으로 인해서 서버가 죽거나 클라우드 서비스를 이용하는 경우 클라우드 서비스 비용이 많이 들어갈 수도 있습니다.  

### 가독성의 중요성
로그는 본질적으로 서비스의 구동 사항들을 기록하거나 아니면 오류 사항들을 출력할 때. 주로 로그를 사용한다고 이야기 할 수 있습니다.  
그러므로 개발자가 손 쉽게 이해하고 오류를 해결할 수 있도록 해야하는 것 같습니다.  
또한 로그 메시지를 규칙을 세워서 작성하시는 것을 추천합니다.  

## 코드로 만들어 보기
일단의 저는 경우 logger 패키지를 통해서 개발할 예정입니다.  
기본적인 디렉토리 구조는 이렇습니다. `go mod tidy`를 통해서 `go.mod` 파일을 만들어 주세요.

### 설치하기
```shell
$ go mod init 
$ go get -u go.uber.org/zap
```
zap 패키지를 사용할 수 있도록 명령어를 통해서 설치 해 주세요.

### logger 패키지 개발하기
```go
var (
	l         *zap.Logger
	s         *zap.SugaredLogger
	Debug     func(args ...interface{})
	Info      func(args ...interface{})
	Warn      func(args ...interface{})
	Error     func(args ...interface{})
	Debugf    func(tmp1 string, args ...interface{})
	Infof     func(tmp1 string, args ...interface{})
	Warnf     func(tmp1 string, args ...interface{})
	Errorf    func(tmp1 string, args ...interface{})
	InfoQuick func(msg string, fields ...zap.Field)
	WarnQuick func(msg string, fields ...zap.Field)
)
```
개발의 생산성을 고려하여서 기본적으로 zap.SugaredLogger를 사용하여서 Logging 하기로 하였습니다.   
필요한 변수들을 먼저 선언해 주었습니다.  

```go
func ZapSetUp() {
	err := LoggerSetUp()
	if err != nil {
		l.Error("Failed to Logger Starting...", zap.Time("time", time.Now()))
	}
}
```
매번 4줄의 코드를 치는 것보다 함수를 통해서 설정을 하는 것이 더 좋은 방법이라고 생각이 되어서 함수를 만들었습니다.  
그럼 본격적으로 중요한 Zap에 대해서 개발해 보겠습니다.  
```go
func LoggerSetUp() error {
	var err error
	date := time.Now().Format("2006-01-02")
	logFile := fmt.Sprintf("./log/%s-local.log", date)

	config := zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.DebugLevel),
		Development: true,
		Encoding:    "json",
		OutputPaths: []string{
			"stdout",
			logFile,
		},
		ErrorOutputPaths: []string{
			"stdout",
			logFile,
		},
		EncoderConfig: zapcore.EncoderConfig{
			LevelKey:     "level",
			TimeKey:      "time",
			MessageKey:   "message",
			CallerKey:    "path",
			EncodeTime:   zapcore.ISO8601TimeEncoder,
			EncodeLevel:  zapcore.LowercaseLevelEncoder,
			EncodeCaller: zapcore.ShortCallerEncoder,
		},
	}

	l, err = config.Build()
	if err != nil {
		l.Error(err.Error())
	}
	s = l.Sugar()
	Debug = s.Debug
	Info = s.Info
	Warn = s.Warn
	Error = s.Error
	Debugf = s.Debugf
	Infof = s.Infof
	Warnf = s.Warnf
	Errorf = s.Errorf
	InfoQuick = l.Info
	WarnQuick = l.Warn

	return nil
}
```
위와 같이 개발하였습니다. 추후에 호출할 때 변수할 수 있도록 먼저 선언해 주는 함수에 넣어주었습니다.  
`zap.Config`의 경우 각종 설정을 할 수 있도록 하였습니다.  
Encoding의 경우 console 방식과 json 방식이 있습니다. 
console의 경우의 `2019-05-04T16:31:17.610+0900    INFO    test/zap.go:17  failed to Process       {"err": "null exception", "attempt": 3, "duration": "1s"}` 형식으로 출력 됩니다. JSON의 경우에는 `{"level":"info","time":"2021-12-16T21:05:04.766+0900","path":"TeamGRIT-VMS/main.go:59","message":"Starting Server...!","time":"2021-12-16T21:05:04.766+0900"}` 형식으로 출력됩니다.

### log 파일과 콘솔 기록하기
```go
date := time.Now().Format("2006-01-02")
logFile := fmt.Sprintf("./log/%s-local.log", date)
```
저는 날짜 형식으로 로그 파일의 이름을 만들어서 기록하였습니다. 다른 방식으로 지정하셔도 됩니다.  
경로도 각자의 취향에 맞게 지정하시면 됩니다.  

```go
Encoding:    "json",
OutputPaths: []string{
	"stdout",
	logFile,
},
ErrorOutputPaths: []string{
	"stdout",
	logFile,
},
```
출력하기 위해서 `OutputPaths`와 `ErrorOutputPaths`를 설정해 주어야 합니다.  
터미널에 출력하기 위해서는 `stdout`를 사용해야 합니다. 파일을 통해서 기록하기 위해서는 위에 지정하였던 `logFile`를 사용하여서 파일로 기록할 수 있습니다.  
만약 터미널에만 출력하고 싶다면 `stdout`만 사용하시면 됩니다, 또 로그 파일에 기록만 하고 싶은 경우 `logFile`만 사용하시면 됩니다.
두 개 다 사용하시고 싶으시면 `stdout`와 `logFile` 같이 사용할 수 있습니다.

## 최종 코드
```go
package logger

import (
	"fmt"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	l         *zap.Logger
	s         *zap.SugaredLogger
	Debug     func(args ...interface{})
	Info      func(args ...interface{})
	Warn      func(args ...interface{})
	Error     func(args ...interface{})
	Debugf    func(tmp1 string, args ...interface{})
	Infof     func(tmp1 string, args ...interface{})
	Warnf     func(tmp1 string, args ...interface{})
	Errorf    func(tmp1 string, args ...interface{})
	InfoQuick func(msg string, fields ...zap.Field)
	WarnQuick func(msg string, fields ...zap.Field)
)

func ZapSetUp() {
	err := LoggerSetUp()
	if err != nil {
		l.Error("Failed to Logger Starting...", zap.Time("time", time.Now()))
	}
}

func LoggerSetUp() error {
	var err error
	date := time.Now().Format("2006-01-02")
	logFile := fmt.Sprintf("./log/%s-local.log", date)

	config := zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.DebugLevel),
		Development: true,
		Encoding:    "json",
		OutputPaths: []string{
			"stdout",
			logFile,
		},
		ErrorOutputPaths: []string{
			"stdout",
			logFile,
		},
		EncoderConfig: zapcore.EncoderConfig{
			LevelKey:     "level",
			TimeKey:      "time",
			MessageKey:   "message",
			CallerKey:    "path",
			EncodeTime:   zapcore.ISO8601TimeEncoder,
			EncodeLevel:  zapcore.LowercaseLevelEncoder,
			EncodeCaller: zapcore.ShortCallerEncoder,
		},
	}

	l, err = config.Build()
	if err != nil {
		l.Error(err.Error())
	}
	s = l.Sugar()
	Debug = s.Debug
	Info = s.Info
	Warn = s.Warn
	Error = s.Error
	Debugf = s.Debugf
	Infof = s.Infof
	Warnf = s.Warnf
	Errorf = s.Errorf
	InfoQuick = l.Info
	WarnQuick = l.Warn

	return nil
}
```

## 참고한 자료
- [직접 만든 Logger 안에서 zap 라이브러리를 사용할 때 Caller에 Logger 보다 위의 계층을 출력하는 방법](https://docs.google.com/document/d/1jYNFSTC7-c21-RFBad3qCmQu0Arm-nxk7F1TS-h4Nds/)
	- 많은 부분 참고한 문서입니다.
- [[Go/Golang] Zap과 시간 기반 파일 로테이션 로깅 수행하기](https://wookiist.dev/110)
- [Golang structured leveled 로그 zap 라이브러리 알아보기](https://minwook-shin.github.io/go-structured-leveled-logging-zap/)