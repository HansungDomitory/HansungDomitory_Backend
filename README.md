![header](https://capsule-render.vercel.app/api?type=waving&color=auto&customColorList=10&height=200&text=HausungDomitory-Backend&fontSize=50&animation=twinkling&fontAlign=58&fontAlignY=36)

# 1. 정의
### 한성대학교 기숙사 애플리케이션(iOS)
기숙사를 이용하는 학생들의 편의를 위한 애플리케이션인 "한성대학교 생활관"에서 필요한 기능을 구현한 API 백엔드 서버이다. </br>
현재 한성대학교 기숙사 사이트는 웹 페이지 상으로만 외박 신청, 공지사항, 기숙사의 현황 등을 확인할 수 있어서 겪는 불편함이 크다고 생각한다. </br>
이를 해소하기 위하여 TypeScript와 Swift를 이용한 한성대학교 기숙사 애플리케이션을 만들었고, </br>
NestJS 프레임워크에서 RestAPI 통신 방법을 사용하여 개발 완료 후 Docker를 통해 패키징하였다. </br>
현재, AWS EC2 인스턴스를 통해 배포 중이다.

# 2. 설치
### 2-1. 프로젝트 파일 설치
```bash
git clone https://github.com/HansungDomitory/HansungDomitory_Backend.git
```
### 2-2. 필요 모듈 설치
```bash
yarn install
```
### 2-3. 프로젝트 실행
```bash
yarn start
```

# 3. 기술 스택

-개발 환경 : Windows, MacOS </br>
-개발 언어 : TypeScript, Swift <br>
-개발 도구 : VSCode, MySQL, Docker, XCode </br>
-프레임워크 : NestJS </br>
-클라우드 서버 : Amazon Web Service

# 4. Database 구조 (ERD)
![ProjectH](https://github.com/user-attachments/assets/a1c0d8eb-c84a-4489-b51a-b07800ce3b19)

# 5. Realease Link
[Backend API 정의서(Swagger)](http://3.145.59.24:3000/api-docs)
