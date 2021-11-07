---
layout: article
title: AWS EKS 클러스터 구축
date: 2021.07.09
image:
tags: DevOps, Kubernetes
---
AWS에서 쿠버네티스 클러스터를 구축하고 예제 애플리케이션을 배포하여서 동작을 확인하겠습니다.  

### 기본 리소스 구축
VPC 등 EKS 클러스터를 구축하기 전에 필요한 리소스를 구성합니다.  
앞으로 기본 리소스라고 칭하겠습니다.  

#### 사용할 도구 설치
아래와 같은 도구는 로컬에 설치해야합니다. 

- [**AWS CLI**](https://aws.amazon.com/ko/cli/)
- [**eksctl**](https://eksctl.io/)
- [**kubectl**](https://kubernetes.io/ko/docs/tasks/tools/install-kubectl-macos/)

AWS CLI를 이용하기 위해서 brew를 이용하여서 AWS CLI를 설치하시면 됩니다.
```bash
$ brew install awscli
```

eksctl는 [**eksctl 설치하기**](https://github.com/Dev-HyunSang/TIL/blob/main/Cloud/eksctl-install.md)에서 확인하실 수 있습니다.

아래와 같이 kubectl 설치 및 설정을 할 수 있습니다.
```bash
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
$ echo "$(<kubectl.sha256)  kubectl" | shasum -a 256 --check
$ kubectl: OK
```

#### 소스 코드 다운로드
제 경우에는 [『클라우드 네이티브를 위한 쿠버네티스 실전 프로젝트: 아마존 EKS로 배우는 데브옵스 및 IaC 기반 서비스 배포와 관리』]()를 읽고 실습 하였습니다.
```bash
$ git clone https://github.com/dybooksIT/k8s-aws-book.git
```
위 명령어를 통해서 GitHub에서 레지스토리를 가져오면 됩니다!

#### 기본 리소스 생성 방법
[CloudFormation] 페이지를 열어서 스택 생성을 누르시면 됩니다!  
이제 [01_base_resources_cfn.yaml](https://github.com/dybooksIT/k8s-aws-book/blob/master/eks-env/01_base_resources_cfn.yaml)를 통해서 설정하시면 됩니다.  

![01](/assets/posts/aws-eks-start/01.png)

위와 같이 준비된 템플릿 &rarr; 템플릿 파일 업로드에서 파일 선택을 통해서 위에서 언급한 파일을 선택해 주시면 됩니다!  

![02](/assets/posts/aws-eks-start/02.png)

스택 이름 설정을 해 주셔야 합니다. 아래와 같은 파라미터는 안 건들으셔도 됩니다.
제가 읽고 있는 책에서는 `eks-work-base`로 하였습니다.

![03](/assets/postsaws-eks-start/03.png)

스택 세부 정보 지정에서는 스킵하셔도 됩니다.

![04](/assets/posts/aws-eks-start/04.png)

검토에서도 스킵하셔도 됩니다.

![](/assets/posts/aws-eks-start/05.png)

정상적으로 기본 리소스가 생성되었습니다.  
이제 상단 오른쪽의 새로 고침을 통해서 상태를 확인해 주시면 됩니다.

### EKS 클러스터 구축
eksctl 명령어로 EKS 클러스터를 구축하는 방법을 살펴보겠습니다.  

#### 기본 리소스 정보 수집
EKS 클러스터를 구축하기 전에는 앞에서 생성한 기본 리소스 정보를 확인해야 합니다.   
이 정보는 CloudFormation 스택 상세 정보에서 확일 할 수 있습니다. 보통 리소스 생성 완료 후(상태가 CREATE_COMPLETE가 된 이후) CloudFormation의 스택 상세 정보를 보면 '출력' 탭에서 작업에 필요한 정보가 표시됩니다.  
출력에서 확인할 수 있습니다.

![06](/images/aws-eks-start/06.png)

#### eksctl 실행
eksctl 명령어는 옵션으로 피라미터를 설정하는 경우 다양한 구성의 EKS 클러스터를 구축할 수 있습니다.  
방금전에 확인해 보았던 WorkerSubnets를 사용하게 됩니다.  
`<WorkerSubnets>`에 WorkerSubentes를 입력하시면 됩니다.

```bash
$ eksctl create cluster \
> --vpc-public-subnet <WorkSubnets 값> \
> --name eks-work-cluster \ 
> --region ap-northeast-2 \
> --version 1.19 \
> --nodegroup-name eks-work-nodegroup \
> --node-type t2.small \
> --nodes 2 \
> --nodes-min 2\
> --nodes-max 5 
```

![07](/assets/posts/aws-eks-start/07.png)

eksctl에서는 명령어를 실행하면 구축 환경 설정을 끝낼 수 있습니다.

### CloudFormation에서 진행 상황 확인 하기
AWS 콘솔에서 CloudFormation에서 진행 상황을 확인할 수 있습니다.  
물론 Shell에서도 확인할 수 있지만 AWS 콘솔에서도 확인할 수 있습니다.  
처음에 했던 `eks-work-base`와 같이 확인할 수 있습니다.  

![08](/assets/posts/aws-eks-start/08.png)

이렇게 확인할 수 있습니다. eksctl를 통해서 생성되었다는 것을 확인할 수 있습니다.  
`CREATE_COMPLTE`라고 정상적으로 생성된 것을 볼 수 있습니다.

eksctl에서는 다음과 같이 CloudFormation 스택 2개를 생성하여 EKS 환경을 구축할 수 있습니다.
- EKS 클러스터 구축
- 워커 노드 구축

#### kubeconfig 설정하기
eksctl은 EKS 클러스터 구축 중에 kubeconfig 파일을 자동으로 업데이트 할 수 있습니다.  
Kubeconfig 파일은 쿠버네티스 클라이언트인 kubectl이 이용할 설정 파일로 접속 대상 쿠버네티스 클러스터의 접속 정보(컨트롤 플레인 URL, 인증 정보, 이용할 쿠버네티스의 네임스페이스 등)을 지정하고 있습니다.  

EKS에 접속하기 위해서는 인증정보는 AWS CLI로 확인 가능하며 eksctl을 사용하여 AWS CLI를 호출하여 인증하기 위한 설정을 kubeconfig 파일에 포함할 수 있습니다.

![09](/assets/posts/aws-eks-start/09.png)

마지막으로 kubectl에서 EKS 클러스터에 접속 가능 여부를 확인해 보겠습니다.  
다음 명령을 실행하게 되면 정상적으로 EKS 클러스터에 접속할 수 있다면 아래와 같이 표시됩니다.  

![10](/assets/posts/aws-eks-start/10.png)

### EKS 클러스터 동작 확인
이상으로 EKS 클러스터 구축이 완료되었습니다. 구축한 클러스터가 정상적으로 동작하는지 확인해 보겠습니다.  
처음에 말한 예제 폴더가 필요합니다. eks-env 디렉토리로 이동한 후 아래와 같은 명령을 실행하면 콘솔에 다음과 같은 메시지가 출력됩니다.

![11](/assets/posts/aws-eks-start/11.png)

정상적을호 pod가 생성된 것을 확인할 수 있습니다.

![12](/assets/posts/aws-eks-start/12.png)

정상적으로 pod가 생성되었다면 위와 같은 메시지가 출력됩니다.

![13](/assets/posts/aws-eks-start/13.png)

위 명령을 통해서 클러스터에 대해서 포트 포워딩을 해 보겠습니다.  
이 명령을 통해서 로컬 컴퓨터에서 실행한 상태로 8080번 포트에 접속하면 방금 실행한 nginx-pod가 80번 포트로 해당 정보를 전송하게 됩니다. nginx 서버에 접속할 수 있게 됩니다.

웹 브라우저를 실행해 http://localhost:8080애 접속하게 되면 EKS 클러스터가 정상적으로 동작하고 있다면 아래와 같은 사진으로 아주아주 잘 보이게 됩니다.

![14](/assets/posts/aws-eks-start/14.png)

### pod 삭제 방법
![15](/assets/posts/aws-eks-start/15.png)

위와 같은 방법으로 pod를 삭제할 수 있습니다!

