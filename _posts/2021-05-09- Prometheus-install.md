---
layout: article
title: Ubuntu20.04에서 Prometheus 설치하기
date: 2021.05.09 
image: 
tags: DevOps
---
안녕하세요. 제가 요즘 관심이 많은 Prometheus와 Prometheus Exprot를 이용해서 서버 상태를 수집하고 시각화 하는 방법에 대해서 이야기 해 볼려고 합니다.

AWS EC2 기반인 Ubuntu20.04 버전에서 Prometheus와 Prometheus Exporter를  설치하는 방법에 대해서 알아보고자 합니다.

## Prometheus 설치
![Prometheus 설치 페이지](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FclD2HG%2Fbtq3mO5aCgk%2FbApdLSJsDKhkk6KMJbFcbk%2Fimg.png)

![wget를 통한 설치 파일 Install](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FEWpHD%2Fbtq3q5RWkod%2FUX7XkfFhRkSiGKiwG9equ1%2Fimg.png)

```shell
$ wget https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.linux-amd64.tar.gz
```

최신 버전인 Prometheus 2.26.0을 wget를 통해서 설치하겠습니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fr7Q7Y%2Fbtq3nTkntQZ%2FdwN8lTkEE6pKIqZfOCY1Jk%2Fimg.png)

![]()

```shell
$ tar zxvf prometheus-2.26.0.linux-amd64.tar.gz
```

tar를 사용하여서 prometheus-2.26.0.linux-amd64.tar.gz를 압축을 풀어보겠습니다.  
그 이후 압축을 풀어주신 폴더 prometheus 설정 파일을 확인해 주시면 됩니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcIJy2c%2Fbtq3mvYPGzN%2FsRBcFCk7QunRmRvG0hfuK1%2Fimg.png)

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbdtPTo%2Fbtq3mNSPMdm%2F1s71uiuu0KvXHI7VsERuZK%2Fimg.png)

```shell
$ ./prometheus --config.file=prometheus.yml
```

위 명령어를 입력하시게 되면 prometheus 설정 파일을 토대로 prometheus를 실행할 수 있습니다.  
이제 http://127.0.0.1:9090으로 접속해 보시면 설정된 prometheus를 볼 수 있습니다.

# Prometheus Node Exporter 설치하기

```shell
$ wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz
```

위 명령어를 통해서 최신 버전인 Prometheus Node Exporter를 설치할 수 있습니다.  
설치 후 Prometheus를 설치한 것처럼 tar를 통해서 압축을 풀어주면 됩니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc4ms1L%2Fbtq3qfAwElT%2FMzROvAZcm28IdgJV8qFwg0%2Fimg.png)

```shell
$ tar zxvf node_exporter-1.1.2.linux-amd64.tar.gz
```

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FWLV0R%2Fbtq3nTEI07T%2FKkgEGgFGfZJNqzSLSlmzJK%2Fimg.png)

```shell
$ cd node_exporter-1.1.2.linux-amd64
$ ./node_exporter &
```

압축을 푼 후에 들어가신 다음에 Prometheus Node Exporter를 실행시켜 주시면 됩니다.

![setting YML File](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FAL3rL%2Fbtq3nCQLsRP%2FVqAT0itzqKPp3idKhKHO0k%2Fimg.png)

```yml
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['localhost:9090']

  - job_name: 'Node-exporter'

    scrape_interval: 10s

    static_configs:
    - targets: ['localhost:9100']
```

prometheus-2.26.0.linux-amd64에 있는 prometheus.yml를 위와 같이 변경해 주시면 Prometheus와 Prometheus Node Exporter를 동시에 실행할 수 있게 됩니다.

추후에 Prometheus와 Prometheus Node Exporter를 통해서 Grafana를 통해서 시각화를 완벽하게 하는 방법에 대해서 알아 보겠습니다.

![Grafana](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FG0v6F%2Fbtq3oSSPe2N%2FJkESKO0pArsQAvlLanhyC0%2Fimg.png)