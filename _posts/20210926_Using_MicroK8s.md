---
layout: article
title: MicroK8s 사용해 보기
date: 2021.09.26
image: 
tags: Ubuntu, Kubernetes, MicroK8s
---
안녕하세요, 회사에서 MicroK8s에 대해서 연구 목적으로 제가 개인적으로 사용하고 있습니다.  
기존의 MicroK8s와 다른점이 많아서 한 번 이야기 해 보면 어떨까 싶어서 글을 작성하게 되었습니다. 기존의 Kubernetes의 경우에는 설치하고 설정까지의 과정이 너무 어렵고 복잡하여서 그런 점들이 싫었던 저에게 MicroK8s는 획기적인 Kubernetes라고 느껴서 지속적으로 사용하고 싶다는 마음이 들어서 이러한 글을 써 보게 되었습니다.

## MicroK8s란 무엇인가?
[**MicroK8s**](https://microk8s.io/)는 Ubuntu에서 제작하여서 공식적으로 지원하고 있는 Kubernetes입니다.  
MicroK8s는 업스트림 릴리스를 추적하고 클러스터링을 간단하게 만드는 가장 작고 빠르며 완전히 호환되는 Kubernetes입니다.  
MicroK8s는 오프라인 개발, 프로토타이핑 및 테스트에 적합합니다.  
VM에서 작고 저렴하며 안정적인 CI/CD용 k8로 사용하십시오. 또한 어플라이언스를 위한 최고의 프로덕션 등급 Kubernetes입니다.  

## MicroK8s를 구동하기 위한 필요한 성능
- 명령을 실행하기 위한 Ubuntu 20.04 LTS, 18.04 LTS 또는 16.04 LTS 환경(또는 지원하는 다른 운영 체제 snapd)
- 최소 20G의 디스크 공간과 4G의 메모리가 권장
- 인터넷 연결

## MicroK8s를 설정하기
### MicroK8s Installation
MircoK8s는 거의 모든 시스템에서 실행하고 사용할 수 있는 최소한의 경량 Kubernetes를 설치합니다.  
Snap을 이용하여서 설치할 수 있습니다.
```shell
$ sudo snap install microk8s -classic
```

### Join the Group
MicroK8s는 관리자 권한이 필요한 명령을 원활하게 사용할 수 있도록 그룹을 생성하면 됩니다.  
사용자를 그룹에 추가하고 .kube 캐싱 디렉토리에 대한 액세스 권한을 얻으려면 아래와 같은 명령어를 사용하면 됩니다.

```shell
$ sudo usermod -a -G microk8s $USER
$ sudo chown -f -R $USER ~/.kube
```

위 명령어를 사용하였다면 세션을 다시 시작하여서 그룹 업데이트를 진행해야 합니다.

```shell
$ su - $USER
```

### MicroK8s 상태 확인
MicroK8s에는 상태를 표시하는 명령이 내장되어 있습니다.  
설치하는 동안 `--wait-ready`를 사용 하여 Kubernetes 서비스가 초기화될 때까지 기다릴 수 있습니다 .

```shell
$ sudo microk8s status --wait-ready
# or
$ sudo microk8s status
$ sudo micork8s inspect
```

`inspect`를 해 보면 경고가 나올 수도 있습니다. IP Forwarding을 키라고 하는데 설정을 하지 않으면 인터넷도 안 되고 Pod 간 연결이 안 될 수도 있습니다.  

```shell
$ sudo iptables -P FORWARD ACCEPT
```

위 설정은 바로 적용되며 우분투를 재시작해도 유지되게 하려면 `/etc/sysctl.conf`파일에서 `net.ipv4.ip_forward=1`를 주석을 해제해야 합니다.

```
$ sudo nano /etc/sysctl.conf
```
![]()

MicroK8s에서 가장 많이 사용되는 기능들을 애드온 형태로 간단히 활성화/비활성화 시킬 수 있도록 만들어졌습니다. Kubernetes를 사용하면서 가장 많이 사용하는 DNS 애드온을 활성화 시켜 보겠습니다.

```shell
$ sudo microk8s enable dns
```

위와 같이 자주 사용하는 애드온의 경우에는 간편하게 설정하여서 사용할 수 있다는 점이 정말 큰 메리트입니다. 기존의 Kubernetes와 다른게 설치, 설정하는 방법도 굉장히 간편하고 편해서 꼭 한 번 사용해 보시면 좋을 것 같습니다.  
다음에는 MircoK8s에서 대쉬보드 배포나 서비스 배포에 대해서 이야기 해 보겠습니다!