import { getItem } from "@/auth/utils/storage";

export class TodoModel {
    constructor(id, content, category, done, todoDate) {
        this.id = id;
        this.content = content;
        this.category = category;
        this.done = done;
        this.todoDate = todoDate;
    }
}


export const API_BASE_URL = (() => {
    let backendHost;
    const hostname = typeof window !== 'undefined' && window.location && window.location.hostname;
    
    if(hostname === "localhost"){
        backendHost = "http://localhost:8080";
    }
    
    return `${backendHost}`;
})();


// API 호출을 위한 함수
export function callApi(api, method, request) {
    // 기본 헤더 설정
    let headers = new Headers({
      "Content-Type": "application/json",
    });
  
    // 로컬 스토리지에서 ACCESS TOKEN 가져오기
    const accessToken = getItem('ACCESS_TOKEN');
    if (accessToken && accessToken !== null) {
      headers.append("Authorization", "Bearer " + accessToken);
    }
    else{
      location.replace('/login');
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
        // 에러 처리
        if (error.status === 403) {
          // 403 에러(권한 없음)인 경우 로그인 페이지로 리디렉션
          window.location.href = "/login";
        }
        return Promise.reject(error);
      });
}
export default { callApi, TodoModel };
