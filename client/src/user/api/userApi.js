// app-config.js 파일에서 API_BASE_URL을 가져옵니다.
import { API_BASE_URL, ACCESS_TOKEN } from "../../config/app-config";


// API 호출을 위한 함수
export function call(api, method, request) {
  // 기본 헤더 설정
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken && accessToken !== null) {
    // 액세스 토큰이 있으면 Authorization 헤더에 추가
    headers.append("Authorization", "Bearer " + accessToken);
  }

  // API 요청 옵션 설정
  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    // GET 메소드가 아닌 경우, 요청 본문을 JSON 문자열로 변환하여 추가
    options.body = JSON.stringify(request);
  }

  // fetch를 사용하여 API 호출
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if(response.status === 400){
          alert("다시 시도하시오")
          return json;
        }
        if (!response.ok) {
          // response.ok가 true이면 정상적인 응답, 아니면 에러 응답
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      console.error("API 호출 오류:", error);
      console.error("요청 URL:", options.url);
      console.error("요청 메소드:", options.method);
      console.error("요청 데이터:", options.body);
      // 에러 처리
      if (error.status === 403) {
        // 403 에러(권한 없음)인 경우 로그인 페이지로 리디렉션
        navigation.navigate('Login');
      }
      return Promise.reject(error);
    });
}

// 회원가입
export async function signup(userDTO) {
  try {
    const response = await call("/users", "POST", userDTO);
    
    console.log("회원가입 성공:", response);
    if (response && response.email) {
      alert("회원가입이 성공적으로 완료되었습니다.");
      navigation.navigate('Login');
    } else {
      alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
      // 에러 메시지가 있다면 표시
      if (response && response.message) {
        console.error("회원가입 실패 이유:", response.message);
      }
    }
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    alert("회원가입 실패 했습니다. 다시 시도해 주세요.", error);
  }
}