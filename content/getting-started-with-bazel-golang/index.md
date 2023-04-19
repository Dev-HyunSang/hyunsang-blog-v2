---
emoji: 🧰
title:  Getting Started with Bazel and Golang
date: '2023-04-13'
author: HyunSang Park
tags: ["Golang", "Build"]
categories: Golang
---
안녕하세요. 이번 포스팅에서는 Bazel을 이용하여 Golang 프로젝트를 빌드하는 방법에 대해 알아보겠습니다.  
생각보다 난해하고 익숙하지 않아서 어려운 부분이 많아서 작성하는 내용이 다소 부족할 수 있습니다.

## Table of Contents
- [What is Bazel?](#what-is-bazel)
- [Installation](#installation)
    - [사용하는 방법](#사용하는-방법)
- [Project Initialization](#project-initialization)

## What is Bazel?
> Bazel은 오픈소스 빌드 및 테스트 도구로, Make, Maven, Gradle과 유사합니다. 사람이 읽을 수 있는 상위 수준의 빌드 언어를 사용합니다. Bazel은 여러 언어로 프로젝트를 지원하고 여러 플랫폼의 출력을 빌드합니다. Bazel은 여러 저장소에서 대규모 코드베이스와 많은 사용자를 지원합니다. - [Bazel 소개](https://bazel.build/about/intro?hl=ko)

### 사용하는 방법
Bazel을 사용하여 프로젝트를 빌드하거나 테스트하려면 일반적으로 다음 단계를 따르세요.  
1. Bazel 설정 Bazel을 다운로드하여 설치합니다. / [Installaiton](#installation)
2. Bazel이 빌드 입력 및 BUILD 파일을 찾고 빌드 출력을 저장하는 디렉터리인 프로젝트 작업공간을 설정합니다.
3. BUILD 파일을 작성하여 Bazel에 빌드 대상과 빌드 방법을 알려줍니다. 도메인별 언어인 Starlark로 빌드 대상을 선언하여 BUILD 파일을 작성합니다. 여기에서 예를 참고하세요. 빌드 대상은 Bazel이 빌드할 입력 아티팩트의 집합과 종속 항목, Bazel이 이를 빌드하는 데 사용할 빌드 규칙 및 빌드 규칙을 구성하는 옵션을 지정합니다. 빌드 규칙은 컴파일러와 링커 등 Bazel이 사용할 빌드 도구와 구성을 지정합니다. Bazel은 지원되는 플랫폼에서 지원되는 언어로 가장 일반적인 아티팩트 유형을 다루는 여러 빌드 규칙과 함께 제공됩니다.
4. 명령줄에서 Bazel을 실행합니다. Bazel은 출력을 작업공간 내에 배치합니다.
Bazel을 사용하여 빌드하는 것 외에 테스트를 실행하고 빌드를 쿼리하여 코드의 종속 항목을 추적할 수도 있습니다.


## Installation
```bash
$ brew install bazel
$ bazel version
```

## Project Initialization
```WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "6b65cb7917b4d1709f9410ffe00ecf3e160edf674b78c54a894471320862184f",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.39.0/rules_go-v0.39.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.39.0/rules_go-v0.39.0.zip",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.19.3")
```