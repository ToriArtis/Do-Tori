import { API_BASE_URL } from "../../config/app-config";

// 액세스 토큰을 저장하기 위한 키 상수
const ACCESS_TOKEN = "ACCESS_TOKEN";
const USER_NICKNAME = "USER_NICKNAME";
const USER_EMAIL ="USER_EMAIL";
const USER_ID = "USER_ID";

// 로그인
export async function login(authDTO) {
  console.log('Login attempt with:', authDTO);
  
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
    console.log('Login response:', response);
    
    const responseData = await response.text();
    console.log('Raw response:', responseData);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = JSON.parse(responseData);
        errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = JSON.parse(responseData);
    console.log("Login success:", result);

    if (result.accessToken) {
      localStorage.setItem(ACCESS_TOKEN, result.accessToken);
      localStorage.setItem(USER_NICKNAME, result.nickName);
      localStorage.setItem(USER_EMAIL, result.email);
      localStorage.setItem(USER_ID, result.id);
  
      if(result.refreshToken) localStorage.setItem("REFRESH_TOKEN", result.refreshToken);
      if(result.provider) localStorage.setItem("PROVIDER", result.provider);

      if(window.history.back() === '/logout') window.location.href = "/";
      else window.history.back();
      
    } else {
      throw new Error("토큰이 없습니다.");
    }

    return result;
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
}
  
  // 로그아웃 함수
  export function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(USER_NICKNAME);
      localStorage.removeItem(USER_EMAIL);
      localStorage.removeItem(USER_ID);
      localStorage.removeItem("PROVIDER");
      window.location.href = "/login";
    }
  }
  
  export default function Logout() {
    if (typeof window !== 'undefined') {
      logout();
    }
    return null;
  }