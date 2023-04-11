---
emoji: 🧰
title:  Getting Started with Skaffold
date: '2023-04-05'
author: HyunSang Park
tags: ["Kubernetes"]
categories: Kubernetes
---
안녕하세요. 요즘 회사에서 팀 이동을 하게 되었습니다. 팀 이동 이후에 Bazel, Skaffold, Golang, GitHub Action 등을 이용해서 CI/CD Pipline을 구성하고자 기획하는 단계에 있습니다.  
오늘은 그 중에서 간단하게 Kubernetes를 사용할 수 있는 Skafflod를 어떻게 사용하는지에 대해서 알아보겠습니다.  

## TOC:
- [What is the Skaffold?](#what-is-the-skaffold)
- [Install Skaffold, minikube and kubectl](#install-skaffold-minikube-and-kubectl)
- [Clone the Sample app](#clone-the-sample-app)
    - [구성 및 실행](#구성-및-실행)

## What is the Skaffold?
> **Skaffold is a command line tool that facilitates continuous development for container based & Kubernetes applications. Skaffold handles the workflow for building, pushing, and deploying your application, and provides building blocks for creating CI/CD pipelines. This enables you to focus on iterating on your application locally while Skaffold continuously deploys to your local or remote Kubernetes cluster, local Docker environment or Cloud Run project.**  

> **Skaffold는 컨테이너 기반 및 Kubernetes 애플리케이션의 지속적인 개발을 용이하게 하는 명령줄 도구입니다. Skaffold는 애플리케이션 빌드, 푸시, 배포를 위한 워크플로우를 처리하고 CI/CD 파이프라인을 생성하기 위한 빌딩 블록을 제공합니다. 따라서 사용자는 로컬에서 애플리케이션을 반복하는 데 집중할 수 있으며, Skaffold는 로컬 또는 원격 Kubernetes 클러스터, 로컬 Docker 환경 또는 Cloud Run 프로젝트에 지속적으로 배포합니다.**  - [Skaffold 2.0 Documentation](https://skaffold.dev/docs/)

## Install Skaffold, minikube and kubectl
```bash
$ brew install skaffold
$ brew install kubectl
# or
$ brew install kubernetes-cli
$ brew install minikube
# Starting minikube
$ minikube start --profile custom
😄  [custom] Darwin 13.2.1 의 minikube v1.30.1
✨  기존 프로필에 기반하여 docker 드라이버를 사용하는 중
👍  custom 클러스터의 custom 컨트롤 플레인 노드를 시작하는 중
🚜  베이스 이미지를 다운받는 중 ...
🤷  docker "custom" container is missing, will recreate.
🔥  Creating docker container (CPUs=2, Memory=7810MB) ...
🐳  쿠버네티스 v1.26.3 을 Docker 23.0.2 런타임으로 설치하는 중
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Kubernetes 구성 요소를 확인...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  애드온 활성화 : storage-provisioner, default-storageclass
🏄  끝났습니다! kubectl이 "custom" 클러스터와 "default" 네임스페이스를 기본적으로 사용하도록 구성되었습니다.
$ skaffold config set --global local-cluster true
$ eval $(minikube -p custom docker-env)
```
- **`minikube` 설치 이후에 구동 시키지 않고 `skaffold dev`를 실행하면 경우 오류가 발생합니다.** 
    - `Build Failed. No push access to specified image repository. Try running with --default-repo flag. Otherwise start a local kubernetes cluster like minikube.`

## Clone the Sample app

1. Clone the Skaffold repository:
```bash
$ git clone https://github.com/GoogleContainerTools/skaffold
```

2. Change to the examples/buildpacks-node-tutorial directory.
```bash
$ cd skaffold/examples/buildpacks-node-tutorial
```

### 구성 및 실행
```bash
$ skaffold init
$ skaffold dev
[web]
[web] > backend@1.0.0 start /workspace
[web] > node src/index.js
[web]
[web] Example app listening on port 3000!
```

## 참고한 문서
- [쿠버네티스용 Continuous Deployment 툴인 Skaffold](https://bcho.tistory.com/1342)
- [Skaffold - Quickstart](https://skaffold.dev/docs/quickstart/)