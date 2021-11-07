---
layout: article
title: Go를 선택하고 해야하는 이유
date: 2021.08.11
image: 
tags: Golang, Software Enginnering
---
안녕하세요, 많은 분들께서 Go에 대해서 관심이 있으시고 배우실려는 분들이 생각보다 많아서 작성하게 되었습니다.  
저 또한 Golang에 입문한지는 약 4개월 정도 되었으며, 그 전에는 JavaScript에 관심이 있어서 Node.js Express를 공부하고 있었습니다.

## 내가 Go를 선택한 이유
Go를 사용하게 된 이유는 다양한 이유가 있습니다.  
다양한 회사에서 다양한 서비스를 하고 있고 타입의 명확성이 있어서 선택하게 되었습니다.  
또한 Docker, Kubernetes도 Go로 만들어진 사실을 알고 더 확고히 하게 되었습니다.  
다양한 회사에서 다양한 서비스를 Go로 개발하여서 돌아가고 있다는 사실을 알게 되었습니다.  
- [당근마켓 개발팀 - 당근마켓의 고언어 도입기, 그리고 활용법](https://youtu.be/mLIthm96u2Q)
- [Uber - How We Built Uber Engineering’s Highest Query per Second Service Using Go ](https://eng.uber.com/go-geofence-highest-query-per-second-service/
)
- [GopherCon 2019: Elena Morozova - How Uber Goes](https://youtu.be/nLskCRJOdxM)
- [Samsung SDS - Google이 만든 프로그래밍 언어, Go](https://www.samsungsds.com/kr/insights/golang.html)

위와 같은 자료를 보고 나서 "우와, Golang라는 언어가 흥미로운 점이 많네"를 느꼈습니다.  
또한 제가 다니고 있는 [TeamGRIT, Inc](https://www.teamgrit.kr/)의 일부 시스템이 Golnag으로 이루어져 있어서 이러한 부분도 어느 정도의 Go를 더 흥미롭게 하는데 일조를 한 것 같습니다.

그럼 Golang에 있어서 장, 단점도 알아 보면 더 좋을 것 같아서 같이 이야기 해 보겠습니다.

## Go 장,단점
Go에 있어서 장점과 단점을 이야기 해 보고자 합니다.

### 장점
- 매우 간단한 문법으로 배우기 쉽습니다.
    - loop 문법으로 while문이 없으며 오직 for문만이 있습니다.
    - class 문법이 없습니다. 생각보다 class 문법을 쓰는 프로그래밍 언어가 많은 것 같습니다.
- 정적타입(Statically typed language) / 강타입(Strongly-Typed) 언어입니다.
- 컴파일속도가 빠른 컴파일 언어입니다.
    - 컴파일 속도가 빨라서 인터프리터 언어처럼 쓸 수 있습니다.
        -  [Uber - Optimizing M3: How Uber Halved Our Metrics Ingestion Latency by (Briefly) Forking the Go Compiler ](https://eng.uber.com/optimizing-m3/)
- 신뢰할 수 있는 제작사 및 대기업들이 사용하고 있습니다.
    - 위에서 이야기한 것 처럼 해외에서는 우버와 넷플릭스, BBC가 사용하고 있으면서 도커와 Kubernetes도 Go로 개발되었습니다. 국내는 카카오엔터프라이즈, 당근마켓, 왓차, 버즈빌, 삼성전자 등 대기업과 스타트업에서 아주아주 다양하게 사용되고 있는 언어입니다.
- 컨벤션이 통일되어 있습니다.
    - 컨벤션에 맞추어 코드를 수정하는 go fmt 기능이 있으며 VS Code에서 저장하는 순간 formatter가 포맷을 바로바로 맞추어줍니다.
- 리소스 사용이 적다
    - 위에서 언급했던 당근마켓 개발팀에서 Go를 선택하고 처음으로 개발한 프로젝트의 경우에는 10스레드와 2GB 밖에 사용하지 않다고 합니다.  
- 학습 속도가 빠릅니다.
    - Go는 [공식 튜토리얼](https://blog.seulgi.kim/2016/07/go.html)만 읽으면 다른 사람들이 쓴 코드를 읽고 쓰는데 아무런 문제가 없습니다. 위에서의 언급한 당근마켓 개발팀에서 Go를 사용하자고 결정한 후 1달 후 시스템을 만들었습니다.

### 단점
- 없는 것이 너무 많습니다(주르륵...)
    - 제네릭 문법, 클래스 문법, 예외 처리 문법 없음, Public, Private 키워드 없음, this 문법 없음
    - 메서드를 만들 수 있으며 인터페이스를 이용해서 다형성을 구현할 수 있습니다. Compostion으로 상속을 대신할 수 있습니다.
    - 라이브러리가 상당이 없습니다. 제가 경험으로 Node.js의 Nodemon을 사용하게 된다면 자동으로 재시동을 해 주게 되는데 자동으로 재시작을 해 주는 라이브러리가 없는 것 같습니다.
- 좋은 IDE가 없습니다.
    - JavaScript의 경우에는 VS Code, WebStorm, Sublime Text 등 다양한 IDE가 있습니다, 하지만 Go의 경우에는 Goland, VS Code 말고 다른 선택지가 별로 많이 없는 것 같습니다.
- 중앙 저장소의 부재
    - Go에서는 GitHub 등의 원격 저장소에 올라온 패키지를 go get 명령어로 다운도르 및 설치 해 옵니다. 조금 많은 불편한 점이 있는 것 같습니다.
- 강력한 라이브러리(프레임워크) 부재
    - Node.js Express, Java Spring, Python Flask 등이 있지만 고만고만한 Echo, Gin, Beego, Fiber 있습니다.
- 우리나라의 한정...! Go를 도입하여서 서비스를 하거나 사용하고 있는 회사가 별로 없습니다.
    - 자바 진형이 대세인 우리나라에서는 타 언어에 비해서 Go를 사용하고 있는 회사가 별로 없고 인사채용에 있어서 해당하는 채용 사항들이 별로 없는 것 같습니다.
    - 하지만 Go의 빠른 성능과 큰 처리를 수월하게 하는 것 때문에 도입하는 회사가 많은 것 같습니다.
    - [Companies currently using Go throughout the world](https://github.com/golang/go/wiki/GoUsers)를 통해서 세계에서 Go를 사용하고 있는 회사를 보실 수 있습니다.

## 참고자료
- [Go 언어의 장점과 단점](https://covenant.tistory.com/204)
- [노마드 코더 - 왜 구글의 프로그래밍 언어 Go가 겁나 핫한건지 5분 설명](https://youtu.be/VDaMhtWNSQU)
- [Why You Should Use Golang and How to Get Started](https://www.rtinsights.com/why-you-should-use-golang-and-how-to-get-started/)
- [Go의 장단점](https://blog.seulgi.kim/2016/07/go.html)