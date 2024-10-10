import axios from 'axios';
import AuthProviderService from "./AuthProviderService";

export const registerInterceptor = async () => {
    axios.interceptors.request.use(async (config) => {        
        // if (config.baseURL === env.API_URL) {
            // const { accessToken } = await AuthProviderService.getGraphAccessToken();
            const accessToken = await AuthProviderService.getClaims();
            console.log("access token register ",accessToken.idToken)
            const bearer = `Bearer ${accessToken.idToken}`;
            config.headers.Authorization = bearer;
            config.headers['Content-Type'] = 'application/json';
        // }
        return config;
    })
}