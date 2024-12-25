// Authentication.js
const tryLogin = (email, password, success, fail, saveToken = false) => {
    // console.log( __APP_IP__)
    // console.log(__APP_PORT__)
    // console.log(__APP_TMDB_API_KEY__)
    // console.log(__APP_REDIRECT_URL__)
    // console.log(__APP_KAKAO_CLIENT_ID__)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.id === email && user.password === password);

    if (user) {
        if (saveToken) {
            console.log("saveToken: True")
            localStorage.setItem('TMDb-Key', user.password);
        }
        else {
            console.log("saveToken: False")
            localStorage.setItem('TMDb-Key', __APP_TMDB_API_KEY__);
        }
        success(user);
    } else {
        fail();
    }
};

const tryRegister = (email, password, success, fail) => {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(existingUser => existingUser.id === email);

        if (userExists) {
            throw new Error('User already exists');
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        success();
    } catch (err) {
        fail(err);
    }
};

const tryKakaoLogin = async (code) => {
    try {
      // 1. 액세스 토큰 요청
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: __APP_KAKAO_CLIENT_ID__,
          redirect_uri: __APP_REDIRECT_URL__,
          code: code,
        }),
      });
  
      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch access token');
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      // 2. 사용자 정보 요청
      const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }
  
      const userInfo = await userInfoResponse.json();
  
      // 3. 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem('TMDb-Key', accessToken);
      localStorage.setItem('kakaoUserInfo', JSON.stringify(userInfo));
  
      console.log('Kakao login successful', userInfo);
      return userInfo;
    } catch (error) {
      console.error('Kakao login error:', error);
      throw error;
    }
  };

export { tryLogin, tryRegister, tryKakaoLogin };
