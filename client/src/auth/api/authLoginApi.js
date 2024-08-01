import { API_BASE_URL } from "../../config/app-config";

// 액세스 토큰을 저장하기 위한 키 상수
const ACCESS_TOKEN = "ACCESS_TOKEN";
const AUTH_NICKNAME = "AUTH_NICKNAME";
const AUTH_EMAIL ="AUTH_EMAIL";

// 로그인
export async function login(authDTO) {
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": authDTO.email,
      "password": authDTO.password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response = await fetch(API_BASE_URL + "/auth/login", requestOptions);
      
      if (!response.ok) {
        // HTTP 오류 상태 처리 (400, 401, 403 등)
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("서버 응답:", result);
  
      if (result.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, result.accessToken);
        localStorage.setItem(AUTH_NICKNAME, result.nickName);
        localStorage.setItem(AUTH_EMAIL, result.email);
        if(result.refreshToken) localStorage.setItem("REFRESH_TOKEN", result.refreshToken);
        if(result.provider) localStorage.setItem("PROVIDER", result.provider);

        return true; // 로그인 성공
      } else {
        throw new Error("토큰이 없습니다.");
      }
  
    } catch (error) {
        console.error("로그인 오류:", error);
        console.error("오류 세부 정보:", error.message);
      throw error;
    }
}

// 로그아웃
export default function Logout() {
  // 로컬 스토리지에 제거
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USER_NICKNAME);
  localStorage.removeItem(USER_ROLESET);
  localStorage.removeItem(USER_EMAIL);
  localStorage.removeItem("PROVIDER");
  // 로그인 페이지로 리디렉션
  navigation.navigate('login');
}