<template>
    <div class="kakao-callback">
      <h2>카카오 로그인 처리 중...</h2>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { tryKakaoLogin } from '@/script/auth/Authentication.js';
  
  export default defineComponent({
    name: 'KakaoCallback',
    data() {
      return {
        error: null as string | null,
      };
    },
    mounted() {
      this.handleKakaoCallback();
    },
    methods: {
      async handleKakaoCallback() {
        const code = new URL(window.location.href).searchParams.get('code');
        if (!code) {
          this.error = '인가 코드를 받지 못했습니다.';
          return;
        }
  
        try {
          await tryKakaoLogin(code);
          this.$router.push('/'); // 로그인 성공 시 메인 페이지로 리다이렉트
        } catch (err) {
          this.error = '카카오 로그인 처리 중 오류가 발생했습니다.';
          console.error('카카오 로그인 오류:', err);
        }
      },
    },
  });
  </script>
  
  <style scoped>
  .kakao-callback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  </style>
  