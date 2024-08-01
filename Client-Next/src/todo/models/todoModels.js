export class TodoModel {
    constructor(id, title, done) {
        this.id = id;
        this.title = title;
        this.done = done;
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

export async function callApi(api, method, request) {
    let options = {
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        method: method,
    };

    if(request){
        options.body = JSON.stringify(request);
    }

    const response = await fetch(API_BASE_URL + api, options);
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json);
    }

    return json;
}