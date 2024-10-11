/* eslint-disable */
import { useNavigate } from "react-router";
import AuthProviderService from "../Services/AuthProviderService";
import withCustomRouter from "./withCustomRouter";
import { useEffect } from "react";
import apiService from "../Services/ApiService";

const AuthCallback = ({ setValidUser, setUserCheck, isValidUser, callback, setinitLoading, initloading, validPersona, setValidPersona, setpersonaAccess, personaAccess,  setuserName, userName }) => {

    useEffect(() => {
        componentDidMount();
    }, [])

    const navigate = useNavigate();

    const processLogin = async (props) => {
        const { accessToken } = await AuthProviderService.getAccessToken();
        console.log(accessToken)
        const path = AuthProviderService.getCallbackPath();
        console.log(path)
        const isLoggedIn = await AuthProviderService.isLoggedIn();
        console.log(isLoggedIn)
        const claims = AuthProviderService.getClaims();
        setuserName(claims.name)
        // setinitLoading(false)
        // setValidUser(isLoggedIn)
        // setUserCheck(isLoggedIn)
        // sessionStorage.setItem("isUserLogged", isLoggedIn);
        // sessionStorage.setItem("idToken", claims.idToken);
        await apiService.fetchPersona((res) => {
            console.log(res)
            console.log(res)
            let roleaccess = [];
            if (res.data.roles) {
                res.data.roles
                    .filter((el) => { !roleaccess.includes(el.access) && roleaccess.push(el.access) })
                console.log("roleaccess ", roleaccess)
            }
            // setpersonaAccess(roleaccess.join(','))
            setValidPersona(true)
            setinitLoading(false)
            setValidUser(isLoggedIn)
            setUserCheck(isLoggedIn)
            sessionStorage.setItem("userName", claims.name);
            sessionStorage.setItem("isUserLogged", isLoggedIn);
            sessionStorage.setItem("idToken", claims.idToken);
            sessionStorage.setItem("roleaccess", roleaccess.join(','));
        }, (err) => {
            console.log('error', err)
            setValidPersona(false)
            setinitLoading(false)
            setValidUser(false)
            setUserCheck(true)
            sessionStorage.setItem("userName", claims.name);
            sessionStorage.setItem("isUserLogged", false);
            sessionStorage.setItem("idToken", claims.idToken);
            sessionStorage.setItem("roleaccess", '');
        })

        navigate(path, { replace: true });

    };

    async function componentDidMount() {
        const isUserLoggedIn = await AuthProviderService.isLoggedIn();
        console.log(isUserLoggedIn)
        if (!isUserLoggedIn && !callback) {
            AuthProviderService.login();
        } else {
            const claimsFirst = AuthProviderService.getClaims();
            console.log("claim", claimsFirst)
            if (claimsFirst && claimsFirst.idToken) {
                await apiService.fetchPersona((res) => {
                    console.log(res)
                    let roleaccess = [];
                    if (res.data.roles) {
                        res.data.roles
                            .filter((el) => { !roleaccess.includes(el.access) && roleaccess.push(el.access) })
                        console.log("roleaccess ", roleaccess)
                    }
                    // setpersonaAccess(roleaccess.join(','))
                    setValidPersona(true)
                    setinitLoading(false)
                    setValidUser(isUserLoggedIn)
                    setUserCheck(isUserLoggedIn)                            
                    sessionStorage.setItem("userName", claimsFirst.name);
                    sessionStorage.setItem("isUserLogged", isUserLoggedIn);
                    sessionStorage.setItem("idToken", claimsFirst.idToken);
                    sessionStorage.setItem("roleaccess", roleaccess.join(','));
                }, (err) => {
                    console.log('error', err)
                    setValidPersona(false)
                    setinitLoading(false)
                    setValidUser(false)
                    setUserCheck(true)
                    sessionStorage.setItem("userName", claimsFirst.name);
                    sessionStorage.setItem("isUserLogged", false);
                    sessionStorage.setItem("idToken", claimsFirst.idToken);
                    sessionStorage.setItem("roleaccess", '');
                })
                // setinitLoading(false)
                // setValidUser(isUserLoggedIn)
                // setUserCheck(isUserLoggedIn)
                // sessionStorage.setItem("isUserLogged", isUserLoggedIn);
                // sessionStorage.setItem("idToken", claimsFirst.idToken);
                // microsoftGraphMemberOf();
            } else {
                AuthProviderService.handlerPromise(processLogin);
            }
        }
    }

    //     async function microsoftGraphMemberOf() {
    //         const authClaim = await AuthProviderService.getClaims();

    //         const headers = new Headers();
    //    const bearer = "Bearer " + authClaim.idToken;
    //    headers.append("Authorization", bearer);
    //    headers.append("ConsistencyLevel", "eventual");
    //    const options = {
    //          method: "GET",
    //          headers: headers
    //    };
    //    const graphEndpoint = "https://graph.microsoft.com/v1.0/me";

    //    const response = await fetch(graphEndpoint, options);
    //    const data = await response.json();
    //    console.log("final data",data)
    // //    const headers = new Headers();
    // //         const bearer = "Bearer " + authClaim.idToken;
    // //         headers.append("Authorization", bearer);
    // //         headers.append("ConsistencyLevel", "eventual");
    // //         const options = {
    // //             method: "GET",
    // //             headers: headers
    // //         };


    // //         const graphEndpoint = `https://graph.microsoft.com/v1.0/me/memberOf`;
    // //         const response = await fetch(graphEndpoint, options);
    // //         const data = await response.json();
    // //         return data;
    //     }
    // componentDidMount();


}

export default withCustomRouter(AuthCallback);
// export default AuthCallback;
/* eslint-enable */