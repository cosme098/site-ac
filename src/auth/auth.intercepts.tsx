import { getToken } from '../auth/auth';
import { api } from '../api'

export function jwtInterceptor() {
    api.interceptors.request.use((request: any) => {
        // add auth header with jwt if account is logged in and request is to the api url
        const isLoggedIn = getToken();
        // const isApiUrl = request.url.startsWith("http://localhost:3000");
        if (isLoggedIn) {
            request.headers.common.Authorization = `Bearer ${getToken()}`;
        }
        return request;
    }, (err) => {
        console.log("esse erro");
        console.log(err);
    });
}
