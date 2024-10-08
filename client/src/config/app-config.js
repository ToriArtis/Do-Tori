let backendHost;

const isClient = typeof window !== 'undefined';

if (isClient) {
  const hostname = window.location.hostname;
  if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
  }
} else {
  // 서버 사이드에서 사용할 기본값 설정
  backendHost = "http://localhost:8080";
}

export const API_BASE_URL = `${backendHost}`;

export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const USER_NICKNAME = "USER_NICKNAME";
export const USER_EMAIL = "USER_EMAIL";
export const USER_ROLESET = "USER_ROLESET";

// 기본 헤더 설정
let headers = new Headers({
  "Content-Type": "application/json",
});

if (isClient) {
  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken && accessToken !== null) {
    // 액세스 토큰이 있으면 Authorization 헤더에 추가
    headers.append("Authorization", "Bearer " + accessToken);
  }
}

export { headers };