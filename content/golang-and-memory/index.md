---
emoji: 🧑🏻‍💻
title: Go언어와 메모리
date: '2022-11-24'
author: HyunSang Park
tags: ["Golang", "Programming"]
categories: Golang
---
요즘 회사에서 새로운 프로젝트를 [Rust]()으로 진행한다고 해서 Rust를 공부하던 도중 제가 예전에도 지금에도 어려워하고 있는 메모리를 조금 더 깊게 공부하고 싶다는 생각이 들어서 제가 메인으로 사용하는 Go언어에서 메모리는 어떻게 사용될지 정리해 보고자 이렇게 글을 작성합니다.

> **본 글은 GC(Garbage Collection)에 대해서 중점적으로 서술합니다.**

## 가비지 컬렉션이란
본격적으로 들어가기 전에 가비지 컬렉션(GC, Garbage Collection)를 알아보고자 합니다.  
가비지는 **유효하지 않는 메모리 주소**, **해제되지 않은 영역**를 의미합니다.  
프로그래밍 언어에서는 통상 'Danling Ojbect'으로 불리고 있으며, Java나 Go에서는 Garbage라는 용어를 사용하고 있습니다.  

옛날 언어들은 BASIC처럼 동적인 메모리 할당 기능이 없어서 FORTRAN, C언어처럼 프로그래머가 할당한 뒤 수동으로 해제 해야하는 방식을 사용했습니다.  
프로그래머가 메모리를 할당해놓고 필요없어진 뒤에도 해제를 안 해서 메모리 누수가 생기거나, 혹은 거꾸로 해제했던 메모리를 실수로 다시 사용하거나, 해제했던 메모리를 또 해제한다거나 하는 온갖 실수가 일어나서 오류가 많이 발생하였습니다.  

메모리와 관련되어서 [double free 취약점](https://showx123.tistory.com/59), [Memory Corruption](https://nextline.tistory.com/81) 등의 보안적 문제가 발생할 수 있습니다.