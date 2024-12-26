# Oauth 카카오 로그인 구현 프로젝트
웹설계 디자인 용으로 구현한 Oauth 카카오 로그인 구현 프로젝트입니다.

JBNU-Teaching/24-02-WSD-Assignment-02-Vue-Demo를 기반으로 구현하였습니다.

https://github.com/JBNU-Teaching/24-02-WSD-Assignment-02-Vue-Demo

**현재 Jcloud를 통해 배포되어 있습니다. (깃허브에는 배포주소 미공개)**
```
배포주소: http://미공개/WSD_OAUTH/
```

## 프로젝트 실행 하는 법
실행 모드가 분리 되어있습니다. **(환경변수가 다르게 설정됨.)**
- .env-dev (개발 모드용 환경 변수)
- .env-prod (프로덕션 모드용 환경 변수)

### .env-{mode} 파일(환경 변수 파일) 설정
**반드시 환경 변수 파일을 만든 후 실행하세요.(없을 시 제대로된 동작을 보장하지 못함)**
```
IP_ADDRESS=localhost // (package.json 파일에 설정된 모드별 host 확인)
PORT=3000 (package.json 파일에 설정된 모드별 port 확인, !포트포워딩 규칙 확인)
TMDB_API_KEY=your-tmdb-api-key
APP_REDIRECT_URL=kakao-callback-redirect-url
APP_KAKAO_CLIENT_ID=kakao-javascript-sdk-api-key
```

### 개발 모드 실행(실시간 수정사항 반영)
```
npm run dev
```

### 프로덕션 모드 실행(빌드된 애플리케이션)
```
npm run build // 애플리케이션 빌드
npm run preview // 빌드된 애플리케이션 배포 (preview는 3000번 포트에서 진행됩니다.)
```

### nginx 배포
```
// sudo systemctl status nginx로 nginx 실행 여부 확인 필수, 만약 실행되어있지 않다면 반드시 실행시킬 것.
sudo systemctl start nginx 
```

## 프론트 엔드
### 로그인 페이지에 구현된 카카오 로그인 버튼
![image](https://github.com/user-attachments/assets/1b775b1d-ff57-4f7c-b665-49707fdcf561)

### 로그인 클릭 시 반응
![image](https://github.com/user-attachments/assets/2e361e20-d6e5-4f0a-9f70-c32ff295a028)

### 로그인/로그아웃 시 헤더 UI 변경
- 로그인
![image](https://github.com/user-attachments/assets/4071de78-1b14-408e-acf7-6ef5f40a8545)

- 로그아웃 **(로그아웃 UI는 구현했지만, 자동으로 로그인 페이지로 이동하기 때문에 볼 수 없을 것)**
![image](https://github.com/user-attachments/assets/96a97c79-1792-43eb-bfd4-645509f9f912)

## 카카오 로그인/로그아웃
### 로그인 코드
```
const handleKakaoLogin = () => {
  console.log("Kakao login function started");
  
  // Kakao SDK가 로드되었는지 확인
  if (!window.Kakao) {
    console.error("Kakao SDK not loaded");
    alert("카카오 로그인을 위한 준비가 되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  // Kakao SDK 초기화
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(__APP_KAKAO_CLIENT_ID__);
  }

  // Kakao 로그인 요청
  window.Kakao.Auth.login({
    success: function(authObj) {
      console.log("Kakao login success", authObj);
      
      // 액세스 토큰으로 사용자 정보 요청
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: function(res) {
          console.log("Kakao user info", res);
          
          // 여기서 백엔드로 사용자 정보를 전송하거나 로컬 상태를 업데이트
          localStorage.setItem('logined_user', res.properties.nickname);
          localStorage.setItem('kakaoUserInfo', JSON.stringify(res));
          
          // 로그인 성공 후 메인 페이지로 리다이렉트
          router.push('/');
        },
        fail: function(error) {
          console.error("Failed to get Kakao user info", error);
          alert("카카오 사용자 정보를 가져오는데 실패했습니다.");
        }
      });
    },
    fail: function(err) {
      console.error("Kakao login failed", err);
      alert("카카오 로그인에 실패했습니다.");
    }
  });
};
```

### 카카오 로그인 성공 시 출력
![image](https://github.com/user-attachments/assets/2aae7f3b-923f-4d3b-a201-47afac13c62b)

- 프로필 표시를 위해 email을 받고 싶었으나, 이메일의 경우 카카오에 검토 신청을 보내야하기 때문에 안받기로 결정함.

### 카카오 로그인 실패 시 출력
![image](https://github.com/user-attachments/assets/573fa69b-b54e-4515-b752-777451f01932)

### 로그아웃 코드
```
removeKey() {
  // 카카오 로그아웃 처리
  if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
    window.Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 완료');
    });
  }

  // localStorage에서 kakao로 시작하는 모든 키 삭제
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('kakao')) {
      localStorage.removeItem(key);
    }
  });

  // 기존 로그인 정보 삭제
  localStorage.removeItem('logined_user');

  // 로그인 페이지로 리다이렉트
  this.$router.push('/signin');
}
```

### 카카오 로그아웃 성공 시 출력되는 로그
![image](https://github.com/user-attachments/assets/921db939-f9f5-4827-bf83-83b7a3c1eb7d)