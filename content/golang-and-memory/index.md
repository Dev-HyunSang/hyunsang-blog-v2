---
emoji: 🧑🏻‍💻
title: Go언어와 메모리
date: '2022-11-24'
author: HyunSang Park
tags: ["Golang", "Programming"]
categories: Golang
---
요즘 회사에서 새로운 프로젝트를 [Rust](https://www.rust-lang.org/)으로 진행한다고 해서 Rust를 공부하던 도중 제가 예전에도 지금에도 어려워하고 있는 메모리를 조금 더 깊게 공부하고 싶다는 생각이 들어서 제가 메인으로 사용하는 Go언어에서 메모리는 어떻게 사용될지 정리해 보고자 이렇게 글을 작성합니다.


> ***본 글은 GC(Garbage Collection)에 대해서 중점적으로 서술합니다.***   
> **[Go 언어의 GC](https://velog.io/@kineo2k/Go-%EC%96%B8%EC%96%B4%EC%9D%98-GC)를 참고하여 작성하였습니다.**

![쓰레기 버리는 Gopher](https://miro.medium.com/max/1400/1*RUBHi-DlwpigyGLRDGAEIg.webp)

## 가비지 컬렉션이란
본격적으로 들어가기 전에 가비지 컬렉션(GC, Garbage Collection)를 알아보고자 합니다.  
가비지는 **유효하지 않는 메모리 주소**, **해제되지 않은 영역**를 의미합니다.  
프로그래밍 언어에서는 통상 'Danling Ojbect'으로 불리고 있으며, Java나 Go에서는 Garbage라는 용어를 사용하고 있습니다.  

옛날 언어들은 BASIC처럼 동적인 메모리 할당 기능이 없어서 FORTRAN, C언어처럼 프로그래머가 할당한 뒤 수동으로 해제 해야하는 방식을 사용했습니다.  
프로그래머가 메모리를 할당해놓고 필요없어진 뒤에도 해제를 안 해서 메모리 누수가 생기거나, 혹은 거꾸로 해제했던 메모리를 실수로 다시 사용하거나, 해제했던 메모리를 또 해제한다거나 하는 온갖 실수가 일어나서 오류가 많이 발생하였습니다.  

이러한 문제들을 해결하기 위해서 제시된 방법이 가비지 컬렉션입니다. 가비지 컬렉션 기능을 채택한 언어의 경우에는 가비지 컬렉션에서 제공하는 할당과 해제를 이용하여 자동적으로 프로그램이 실행되며 생기는 쓸모없어지는 메모리들을 수집하고 관리해줍니다.  

메모리와 관련되어서 [double free 취약점](https://showx123.tistory.com/59), [Memory Corruption 취약점](https://nextline.tistory.com/81) 등의 보안적 문제가 발생할 수 있습니다.

## Golang with GC
[runtime](https://pkg.go.dev/runtime) 패키지의 [`mgc.go`](https://go.dev/src/runtime/mgc.go)에 서술되어 있는 Go언어 GC(Garbage Collection)에 대한 설명입니다.  

```go
// Garbage collector (GC).
//
// The GC runs concurrently with mutator threads, is type accurate (aka precise), allows multiple
// GC thread to run in parallel. It is a concurrent mark and sweep that uses a write barrier. It is
// non-generational and non-compacting. Allocation is done using size segregated per P allocation
// areas to minimize fragmentation while eliminating locks in the common case.
```

### 삼색 표시 후 쓸어담기 알고리즘
Go언어의 GC는 **삼색 표시 후 쓸어담기 알고리즘**를 사용합니다.  
먼저 **삼색 집합**에 대해서 알아봐야겠죠?

- 흰색 집합(White set): 프로그램에서 더 이상 접근할 수 없어서 GC 대상이 되는 객체
- 검은색 집합(Black set): 프로그램이 사용하고 있고, 흰색 집합의 객체에 대한 참고가 없는 객체. 흰색 집합의 객체가 검은색 집합의 객체의 참조를 가져도 문제가 되지 않음.
- 회색 집합(Grey set): 프로그램이 사용하고 있고, 흰색 집합의 객체를 가리킬 수도 있어서 검사를 진행해야하는 객체

삼색 표시 후 쓸어담기 알고리즘은 아래와 같은 과정으로 진행됩니다.  
1. 가비지 컬렉션은 모든 객체를 흰색으로 칠한 상태에서 시작합니다.
2. GC가 모든 루트 객체(Root Object)를 방문해서 회색으로 칠합니다. 여기서 루트 객체란, 스택이나 전역 변수처럼 애플리케이션에서 직접 접근할 수 있는 오브젝트를 이야기합니다.
3. GC는 회색 집합의 객체를 하나씩 검은색으로 변경하면서 그 객체가 가리키는 희색 집합 객체가 확인되면 해당 객체를 회색으로 칠합니다.
4. 3번의 작업을 회색 집합에 객체가 없어질 때까지 반복합니다. 이 작업이 끝나면 더 이상 접근할 수 없는 객체만 희색 집합에 남게 됩니다.
5. 흰색 집합의 객체에 할당된 메모리 공간을 회수하여 메모리를 확보합니다.

![](https://velog.velcdn.com/images%2Fkineo2k%2Fpost%2F9e9edd37-9349-4557-a545-06b0969e1174%2Ftricolor-mark-and-sweep.png)

GC 수행 중 **뮤테이터 스레드(Mutator threads)**가 힙에 객체 참조를 변경한다면 어떻게 될까요?  
뮤테이터 스레드(Mutator threads)란 GC를 수행하는 스레드를 제외한 우리가 작성한 애플리케이션의 스테드를 의미합니다.  
이 경우 **GC를 수행하는 객체의 정합성을 보장할 수 없어서 문제가 발생**할 수 있습니다. 그래서 GC는 안전하고 정확한 GC 수행을 위해서 뮤테이터 스레드를 중지 시킵니다. 뮤테이터 스레드를 중지한 상태를 Stop the world(STW)라고 부르며, 가비지 컬렉션 안전점(Garbage collection safe−point)이 만들어집니다.  
또한, 이것이 **애플리케이션 성능 저하의 주요 원인**이 됩니다.  

Go언어의 GC는 채널(Channel) 변수에 대해서도 동일하게 메모리 회수 작업을 수행합니다. 더 이상 접근할 수 없는 채널이라면 해당 채널이 열려 있는 상태더라도 메모리에서 해제됩니다. 또한 Java 등 다른 언어처럼 Go언어에서도 직접 GC를 실행할 수 있도록 `runtime.GC()` 함수를 제공합니다.  
하지만 GC 호출에는 대가가 따르는 만큼 `runtime.GC()` 호출에는 GC에 대한 깊은 이해와 주의가 필요합니다.

## 참고한 자료
- [Go 언어의 GC에 대해](https://engineering.linecorp.com/ko/blog/go-gc/)
- [Go: How Does the Garbage Collector Watch Your Application?](https://medium.com/a-journey-with-go/go-how-does-the-garbage-collector-watch-your-application-dbef99be2c35)
- [Go 언어의 GC](https://velog.io/@kineo2k/Go-%EC%96%B8%EC%96%B4%EC%9D%98-GC)
- [Tricolor Algorithms in Go](https://www.developer.com/languages/tricolor-algorithm-golang/)

```toc

```