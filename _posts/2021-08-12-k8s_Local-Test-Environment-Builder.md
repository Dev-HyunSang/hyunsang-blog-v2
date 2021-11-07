---
layout: article
title: 로컬 Kubernetes 구축하기
date: 2021.08.12
image: 
tags: Kubernetes, DevOps, Infrastructure
---
안녕하세요, 요즘 Kubernetes에 대해서 엄청나게 열심히 공부하고 있고 관심도 많습니다.  
클라우드 환경이나 온프레미스 환경에서의 Kubernetes 기반의 서버를 돌리기 전 로컬에서도 Kubernetes가 잘 동작하고 있는지 살펴보아야 합니다.  
오늘은 어떻게 하면 로컬에서 Kubernetes를 구축 해 보겠습니다.

## Certified Kubernetes Distribution/Platform
로컬에서 쿠버네티스를 구동하는 방법은 다양합니다.  
- 미니큐브(Minikube)
- Docker Desktop for Mac/Windows
- Kind(Kubernetes in Docker)

그리고 쿠버네티스 구촉 도구는 아래와 같이 다양합니다.
- 큐브어드민(kubeadm)
- 랜처(Rancher)

![Certified Kubernetes Distribution/Platform Logo](https://www.cncf.io/wp-content/uploads/2020/07/certified_kubernetes_color-1.png")

위에서 언급한 모든 방법들은 쿠버네티스 적합성 인증 프로그램에서 인증된 Certified Kubernetes Distribution/Platform입니다.  
오늘은 미니큐브(Minikube)와 Kind(Kubernetes in Docker)를 사용하겠습니다.
## 미니큐브 설치 및 설정
```shell
# 홈브류 설치
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 패키지 정보 업데이트
$ brew update

$ brew install hyperkit
```
1. [홈브류](https://brew.sh/)를 설치 해 주세요.
2. 홈브류 설치가 완료 되었다면 홈브류를 업데이트 시켜 주세요.
3. [하이퍼킷](https://github.com/moby/hyperkit)을 설치하여 주시면 기본적인 세팅은 끝!

같은 방법으로 미니큐브도 홈브류를 사용하여서 설치하면 됩니다!

```shell
# 미니큐브 설치
$ brew install minikube

# 미니큐브 버전 확인을 통해서 정상적으로 설치 되었는지 확인
$ minikube version
minikube version: v1.22.0
commit: a03fbcf166e6f74ef224d4a63be4277d017bb62e
```
1. 위와 기본 세팅에서 했던 것처럼 `brew install` 통해서 minikube를 설치 해 주시면 됩니다.
2. 미니큐브가 정상적으로 설치 되었는지 확인하기 위해서 `minikube version` 명령어를 통해서 설치하시면 됩니다.

이제 `minikube start` 명령어로 쿠버네티스를 기동합니다. 사용할 쿠버네티스 버전을 지정할 경우 `--kubernetes-version` 옵션을 사용하면 됩니다. 하이퍼킷 드라이버를 사용하기 위해서 `--driver=hyperkit`을 지정하고 있습니다.  
저는 최신 버전의 쿠버네티스 버전을 지정하였습니다. [쿠버네티스 버전](https://kubernetes.io/ko/releases/)에서 확인할 수 있습니다.
```shell
# 미니큐브를 사용하여 쿠버네티스 v.1.22.0 환경을 구축하고 기동
$ minikube start driver=hyperkit --kubernetes-version v1.22.0
😄  Darwin 11.5 의 minikube v1.22.0
✨  자동적으로 hyperkit 드라이버가 선택되었습니다. 다른 드라이버 목록: virtualbox, ssh
👍  minikube 클러스터의 minikube 컨트롤 플레인 노드를 시작하는 중
💾  쿠버네티스 v1.22.0 을 다운로드 중 ...
    > preloaded-images-k8s-v11-v1...: 495.61 MiB / 495.61 MiB  100.00% 9.80 MiB
🔥  hyperkit VM (CPUs=2, Memory=2200MB, Disk=20000MB) 를 생성하는 중 ...
🐳  쿠버네티스 v1.22.0 을 Docker 20.10.6 런타임으로 설치하는 중
    ▪ 인증서 및 키를 생성하는 중 ...
    ▪ 컨트롤 플레인이 부팅...
    ▪ RBAC 규칙을 구성하는 중 ...
🔎  Kubernetes 구성 요소를 확인...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  애드온 활성화 : default-storageclass, storage-provisioner
🏄  끝났습니다! kubectl이 "minikube" 클러스터와 "default" 네임스페이스를 기본적으로 사용하도록 구성되었습니다.
```
미니큐브 클러스터가 정상적으로 가동되었는지 확인해 보겠습니다.

```shell
# 미니큐브 클러스터 상태 확인하기
$ minikube status
minikube status
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```
여러 쿠버네티스 클러스터를 사용하는 경우에는 kubectl를 사용하여서 컨텍스트를 전환하여 사용해야 합니다.  

아래 명령어처럼 kubectl에서 미니큐브 클러스터를 조작할 수 있습니다.  
```shell
# 컨텍스트 전환
$ kubectl config use-context minikube
```
kubectl에서 로컬 머신에서 기동하고 있는 가상 머신 미니큐브를 쿠버네티스 노드로 인식합니다.  
```shell
# 노드 확인
$ kubectl get nodes
NAME       STATUS   ROLES                  AGE     VERSION
minikube   Ready    control-plane,master   4m25s   v1.22.0
```
사용하지 않는 미니큐브 클러스터는 아래와 같이 쉽게 삭제할 수 있습니다.

```shell
# 미니큐브 클러스터 정지
$ minikube delete
🔥  hyperkit 의 "minikube" 를 삭제하는 중 ...
💀  "minikube" 클러스터 관련 정보가 모두 삭제되었습니다
```
그 외에도 미니큐브에 `minikube tunnel` 명령어를 사용하여서 CdlusterIP 서비스에 연결하거나 Addon 기능을 사용하여서 이스티오(Istio) 등의 다양한 소프트웨어를 설치할 수도 있습니다.

## kind 설치 및 설정
![kind](https://d33wubrfki0l68.cloudfront.net/d0c94836ab5b896f29728f3c4798054539303799/9f948/logo/logo.png)

이름처럼 도커 컨테이너를 여러 개 기동하고 그 컨테이너를 쿠버네티스 노드로 사용하는 것으로, 여러 대로 구성된 쿠버네티스 클러스터를 구축합니다. 현재 로컬 환경에서 멀티 노드 쿨러스터를 구축하려면 이 kind를 사용하는 것이 가장 좋습니다.

kind도 홈브류를 통해서 설치할 수 있습니다.
```shell
# kind 설치
$ brew install kind

# kind 버전 확인
$ kind version
kind v0.11.1 go1.16.4 darwin/amd64
```
클러스터를 구축하고 구성 설정을 YAML 파일로 관리 해 보겠습니다.  
마스커 한 대와 워커 한 대로 구성하였습니다. kind에서 사용하는 도커 이미지는 도커 허브의 kindest Organization에서 관리됩니다.  

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes: 
- role: control-plane
  image: kindest/node:v1.22.0
- role: worker
  image: kindest/node:v1.18.15
```
실제로 클러스터를 구축하려면 위의 구성 파일을 지정한 후 `kind create cluster` 명령어를 실행합니다.  

```shell
# kind에서 쿠버네티스 클러스터 기동
$ kind create cluster --config kind.yaml --name kindcluster
Creating cluster "kindcluster" ...
 ✓ Ensuring node image (kindest/node:v1.18.15) 🖼
 ✓ Preparing nodes 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-kindcluster"
You can now use your cluster with:

kubectl cluster-info --context kind-kindcluster

Thanks for using kind! 😊
```
컨텍스트를 전환한 후 kubectl에서 kind 클러스터를 조작할 수 있습니다.
```shell
# 컨텍스트 전환
$ kubectl config use-context kind-kindcluster
Switched to context "kind-kindcluster".

# 노드 확인
$ kubectl get nodes
NAME                        STATUS   ROLES    AGE     VERSION
kindcluster-control-plane   Ready    master   5m5s    v1.18.15
kindcluster-worker          Ready    <none>   4m27s   v1.18.15

# 도커 컨테이너 확인 (일부 발췌)
$ docker container ls
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                       NAMES
c734a911ae5f   kindest/node:v1.18.15    "/usr/local/bin/entr…"   5 minutes ago   Up 5 minutes   127.0.0.1:52014->6443/tcp   kindcluster-control-plane
0534a2bbc09c   kindest/node:v1.18.15    "/usr/local/bin/entr…"   5 minutes ago   Up 5 minutes                               kindcluster-worker
04aedcd5d52e   99f89471f470             "/storage-provisione…"   6 minutes ago   Up 6 minutes                               k8s_storage-provisioner_storage-provisioner_kube-system_8920b780-3ab8-435a-9345-f4ee81b6c2e0_39
a65a3e61d72a   296a6d5035e2             "/coredns -conf /etc…"   6 minutes ago   Up 6 minutes                               k8s_coredns_coredns-558bd4d5db-r84tg_kube-system_341b5a99-afa6-4cdd-8ab2-f12338735f65_5
749b1704f5e7   8c2c38aa676e             "/kube-vpnkit-forwar…"   6 minutes ago   Up 6 minutes                               k8s_vpnkit-controller_vpnkit-controller_kube-system_f662ebce-10b9-4a95-9ccc-56d252e24c59_73
9d45f1094365   296a6d5035e2             "/coredns -conf /etc…"   6 minutes ago   Up 6 minutes                               k8s_coredns_coredns-558bd4d5db-fjqd8_kube-system_f33ed8e7-6900-4185-956b-2229bdcf9935_5
0cd03200138d   k8s.gcr.io/pause:3.4.1   "/pause"                 6 minutes ago   Up 6 minutes                               k8s_POD_vpnkit-controller_kube-system_f662ebce-10b9-4a95-9ccc-56d252e24c59_5
9b7ae535ca65   k8s.gcr.io/pause:3.4.1   "/pause"                 6 minutes ago   Up 6 minutes                               k8s_POD_coredns-558bd4d5db-r84tg_kube-system_341b5a99-afa6-4cdd-8ab2-f12338735f65_5
f7109027fb68   k8s.gcr.io/pause:3.4.1   "/pause"                 6 minutes ago   Up 6 minutes                               k8s_POD_storage-provisioner_kube-system_8920b780-3ab8-435a-9345-f4ee81b6c2e0_5
97bfa3800dc8   k8s.gcr.io/pause:3.4.1   "/pause"                 6 minutes ago   Up 6 minutes                               k8s_POD_coredns-558bd4d5db-fjqd8_kube-system_f33ed8e7-6900-4185-956b-2229bdcf9935_5
137bcf3b864a   a6ebd1c1ad98             "/usr/local/bin/kube…"   6 minutes ago   Up 6 minutes                               k8s_kube-proxy_kube-proxy-pm2ng_kube-system_c3c8a8ae-5ca9-4ed4-954a-93c6ecd027b2_5
3fcbcd26186c   k8s.gcr.io/pause:3.4.1   "/pause"                 6 minutes ago   Up 6 minutes                               k8s_POD_kube-proxy-pm2ng_kube-system_c3c8a8ae-5ca9-4ed4-954a-93c6ecd027b2_5
```
 
사용하지 않는 kind 클러스터는 아래 명령어로 삭제할 수 있습니다.
```shell
# kind 클러스터 삭제
$ kind delete cluster --name kindcluster
Deleting cluster "kindcluster" ...
```

kind는 내부에서 kubeadm이라는 구축 도구를 사용하여서 구축 시 설정 파일에 대해 패치를 적용하는 kubeadmConfigPatches와 kubeadmConfigPatchesJson6902 등을 사용하여 다양한 클러스터를 구축할 수 있습니다.  
알파 클러스터를 생성할 때도 이 설정을 사용하여 FeatureGates를 활성합니다.
```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
kubeadmConfigPatches:
  - |
    apiVersion: kubeadm.k8s.io/v1beta2
    kind: ClusterConfiguration
    metadata:
      name: config
    apiServer:
      extraArgs:
        "feature-gates": "EphemeralContainers=true,HPAScaleToZero=true,TTLAfterFinished=true,ServiceTopology=true,ImmutableEphemeralVolumes=true"
    scheduler:
      extraArgs:
        "feature-gates": "EphemeralContainers=true,HPAScaleToZero=true,TTLAfterFinished=true,ServiceTopology=true,NonPreemptingPriority=true"
    controllerManager:
      extraArgs:
        "feature-gates": "HPAScaleToZero=true,TTLAfterFinished=true,ImmutableEphemeralVolumes=true"
  - |
```
위와 같이 알파 클러스터를 생성할 수 있습니다!  
오늘은 minikube와 kind를 이용하여서 Kubernetes를 로컬 환경에서 구축 해 보았습니다.
# 참고한 문서
- [kind Configuration](https://kind.sigs.k8s.io/docs/user/configuration/)
- 서적: [쿠버네티스 완벽 가이드](http://www.yes24.com/Product/Goods/102847901)