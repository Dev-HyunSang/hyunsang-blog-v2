---
emoji: 🧑🏻‍💻
title: Go언어에서 &와 *는 무엇을 뜻할까?
date: '2022-01-01'
author: HyunSang Park
tags: ["Golang", "Programming"]
categories: Golang
---
안녕하세요. Go언어를 사용하면서 궁금증 생겨서 궁금증을 해결하고자 작성하게 되었습니다.  
`&`와 `*`는 무엇을 뜻하고 ㄴ무엇을 하는지에 대해서 궁금증이 생겨서 찾아 보았습니다.  
또한 포인터에 대해서 궁금증이 생겨서 찾아보고 공부한 내용들을 작성해 보았습니다.  

**참고한 글로써는 아래와 같습니다.**
- [Stack Overflow - What is the meaning of '*' and '&'?](https://stackoverflow.com/questions/38172661/what-is-the-meaning-of-and)
- [Stack Overflow - What does the '*' and '&' symbol in Go mean?](https://stackoverflow.com/questions/49572378/what-does-the-and-symbol-in-go-mean)
- [golang.org - Pointers](https://go.dev/tour/moretypes/1)

## 일단 Pointer는 무엇인가?
포인터(Pointer)는 프로그래밍 언어에서 다른 변수, 혹은 그 변수의 메모리 공간 주소를 가리키는 변수를 말합니다.  
포인터가 가리키는 값을 가져오는 것을 역참조라고 합니다.  
포인터는 어셈블리어와 C, C++, 파스칼 등에서 하위 레벨까지 제어할 수 있는 언어에서 주로 쓰이고 있습니다.  
일반적으로 포인터는 메모리 주소로 바꿀 수 있습니다. 포인터는 다른 변수나 함수를 가리키도록 사용합니다.  

### 주소값의 이해
데이터의 주소값이란 해당 데이터가 저장된 메모리의 시작 주소를 의미합니다.  
C언어에서는 이러한 주소값을 1바티으 크기의 메모리 공간으로 나누어 표현합니다.  
예를 들어, int형 데이터는 4바이트의 크기를 가지지만, int형 데이터의 주소값은 시작 주소 1바이트만을 가리킵니다.  

## Go언어에서의 포인터
Go언어는 프로그램 내에서 값의 참조와 레코드를 전달할 수 있는 [Pointers](https://ko.wikipedia.org/wiki/%ED%8F%AC%EC%9D%B8%ED%84%B0_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)를 지원합니다. 예제 보면서 함께 알아 보겠습니다.  

```go
package main

import "fmt"

func zeroval(ival int) {
	ival = 0
}


func zeroptr(iptr *int) {
	*iptr = 0
}
func main() {
	i := 1
	fmt.Println("initial:", i)
	zeroval(i)
	fmt.Println("zeroval:", i)

	zeroptr(&i)
	fmt.Println("zeroptr:", i)

	fmt.Println("pointer:", &i)
}
```
<div align="center">
<p style="font-size: 14px; color: gray;"><a herf="https://mingrammer.com/gobyexample/pointers/">Go by Example: 포인터</a> 예제와 설명을 참고하였습니다.</p>
</div>


두 함수 zeroval와 zeroptr를 가지고 포인터가 값과 다르게 어떻게 동작하는지 살펴 보겠습니다. zeroval은 int 타입 파라미터를 가지므로 인자는 값으로 전달됩니다. zeroval는 함수를 호출할 때의 값을 ival에 복사하여서 가져오게 됩니다.  

그에 반해서 zeroptr는 `int`형 포인터를 받을 수 있또록 `*int`타입을 파라미터로 갖고 있습니다.  
함수 안에서 `*iptr`는 메모리 주소에서 해당 주소의 현재값으로 포인터를 역참조(dereference) 합니다. 역참조된 포인터에 값을 할당하면 이는 참조된 주소의 값을 바꾸게 됩니다.

&i는 i의 메모리 주소를 반환합니다. 즉 i의 포인터입니다.  
포인터도 `fmt` 패키지를 통해서 출력할 수 있습니다.  

```shell
$ go run pointers.go
initial: 1
zeroval: 1
zeroptr: 0
pointer: 0x42131100
```

zeroval은 `main`에 있는 i값을 바꾸지 않지만, `zeroptr`은 해당 값의 메모리 주소를 참조하고 있기 때문에 값을 바꿀 수 있습니다.

## 참고한 문서 
- [Go by Example: 포인터](https://mingrammer.com/gobyexample/pointers/)
- [Stack Overflow - What is the meaning of '*' and '&'?](https://stackoverflow.com/questions/38172661/what-is-the-meaning-of-and)
- [Stack Overflow - What does the '*' and '&' symbol in Go mean?](https://stackoverflow.com/questions/49572378/what-does-the-and-symbol-in-go-mean)
- [golang.org - Pointers](https://go.dev/tour/moretypes/1)
- [위키백과 - 포인터 (프로그래밍)](https://ko.wikipedia.org/wiki/%ED%8F%AC%EC%9D%B8%ED%84%B0_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)
- [TCPShool.com - 포인터의 개념](http://www.tcpschool.com/c/c_pointer_intro)