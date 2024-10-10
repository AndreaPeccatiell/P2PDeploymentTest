import { authProvider } from './AuthProvider';
import { graphAuthProvider } from "./GraphAuthProvider";

class AuthProviderServiceWrap {
    _CallbackPathName = 'callbackPath';
    
    getCallbackPath() {
        console.log("inside getCallbackPath")
        const path = localStorage.getItem(this._CallbackPathName);
        if (path) {
            return path;
        }
        return '/';
    }

    login() {
        console.log("inside login")
        authProvider.login();
    }

    logout() {
        console.log("inside logout")
        authProvider.signout();
    }


    handlerPromise(callback) {
        console.log("inside handlerpromise")
        authProvider.handlePromiseRedirectCallback(callback);
    }

    async isLoggedIn() {
        console.log("inside isloggedin")
        return authProvider.isLoggedIn();
    }

    async getAccessToken() {
        console.log("inside getaccesstoken")
        return authProvider.getAccessToken();
    }

    async getGatewayAccessToken() {
        return authProvider.getGatewayAccessToken();
    }

    async getGraphAccessToken() {
        console.log("inside getgraphaccesstoken")
        return graphAuthProvider.getAccessToken();
    }

    getClaims() {
        console.log("inside getclaim")
        return authProvider.getIdTokenClaims();
    }

    setCallbackPath(path) {
        console.log("inside setcallbackpath")
        if (typeof path === 'string') {
            localStorage.setItem(this._CallbackPathName, path);
        } else {
            localStorage.setItem(this._CallbackPathName, '/');
        }
    }
}

const AuthProviderService = new AuthProviderServiceWrap();

export default AuthProviderService;
