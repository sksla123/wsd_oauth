<template>
  <div id="container">
    <header class="app-header" :class="{ 'scrolled': isScrolled }">
      <div class="header-left">
        <div class="logo">
          <a href="/#/">
            <font-awesome-icon :icon="['fas', 'ticket']" style="height: 100%; color: #E50914;" />
          </a>
        </div>
        <nav class="nav-links desktop-nav">
          <ul>
            <li><a href="/#/">홈</a></li>
            <li><a href="/#/search">찾아보기</a></li>
            <li><a href="/#/wishlist">내가 찜한 리스트</a></li>
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <div class="profile-dropdown">
          <button class="icon-button" @click="toggleDropdown">
            <font-awesome-icon :icon="['fas', 'user']" />
          </button>
          <div v-if="isDropdownOpen" class="dropdown-content">
            <p v-if="loginedUser">{{ loginedUser }}</p>
            <p v-else>로그인 해주세요</p>
            <button v-if="loginedUser" @click="logout" class="logout-button">로그아웃</button>
            <button v-else @click="login" class="login-button">로그인</button>
          </div>
        </div>
        <button class="icon-button mobile-menu-button" @click="toggleMobileMenu">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div class="mobile-nav" :class="{ 'open': isMobileMenuOpen }">
      <button class="close-button" @click="toggleMobileMenu">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <nav>
        <ul>
          <li><a href="/#/" @click="toggleMobileMenu">홈</a></li>
          <li><a href="/#/search" @click="toggleMobileMenu">찾아보기</a></li>
          <li><a href="/#/wishlist" @click="toggleMobileMenu">내가 찜한 리스트</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch, faUser, faTicket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faSearch, faUser, faTicket, faBars, faTimes);

export default {
  name: 'MainHeader',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false,
      isDropdownOpen: false,
      loginedUser: null
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.loginedUser = localStorage.getItem('logined_user');
    },
    logout() {
      this.removeKey();
    },
    login() {
      this.removeKey();
    },
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
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(__APP_KAKAO_CLIENT_ID__);
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style>

.app-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 4%;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.app-header:hover,
.app-header.scrolled {
  background-color: #141414;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.logo {
  height: 30px;
  margin-right: 25px;
  justify-items: center;
  align-items: center;
}

.nav-links ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin-right: 20px;
}

.nav-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #b3b3b3;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 20px;
  cursor: pointer;
}

.icon-button:hover {
  opacity: 0.5;
}

.mobile-menu-button {
  display: none;
}

.mobile-nav {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  width: 50%;
  height: 100%;
  background-color: #141414;
  z-index: 1001;
  transition: right 0.3s ease;
}

.mobile-nav.open {
  right: 0;
}

.mobile-nav ul {
  list-style-type: none;
  padding: 0;
  margin-top: 60px;
}

.mobile-nav li {
  margin: 20px 0;
}

.mobile-nav a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 1.2rem;
  display: block;
  padding: 10px 20px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.profile-dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #000;
  min-width: 150px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  padding: 10px;
}

.dropdown-content p {
  color: white;
  padding: 5px 0;
  margin: 0;
}

.logout-button, .login-button {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background-color: #E50914;
  color: black;
  border: none;
  cursor: pointer;
}

.logout-button:hover, .login-button:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-nav {
    display: block;
  }

  .icon-button {
    font-size: 0.75rem;
    margin-left: 10px;
  }

  a {
    text-align: left;
    font-size: 1.15rem !important;
  }
}
</style>
