import Utils from "../Common/Utils";
import AuthProviderService from "./AuthProviderService";

class ApiService {
    async fetchPersona(onComplete, onError) {
        const env = Utils.getEnvVars();
        let endpoint = env.API_URL;
        let url = endpoint + "/auth/me";        
        console.log(url)   
        // const authClaim = await AuthProviderService.getClaims();   
        // const queryParams = {
        //     'email': authClaim.username
        // };
        // const queryString = Object.keys(queryParams)
        //     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        //     .join('&');
        // if (queryString) url = `${url}?${queryString}`
        await this.fetchAuthData(url, onComplete, onError);      
    }  

    async fetchAuthData(url, onComplete, onError) {
        try {
            const authClaim = await AuthProviderService.getClaims();
            // let headersList = {
            //     "claimtoken": authClaim.idToken,
            //     'Content-Type': 'application/json'                
            // }
            // const options = {
            //     method: "GET",
            //     headers: headersList
            // };

            const options = {
                method: "POST",
                body: JSON.stringify({'claimtoken':authClaim.idToken})
            };
            const response = await fetch(new Request(url, options))            
            if (!response.ok) {
                if (onError) onError(new Error('Network response was not ok'));
            } else {
                const data = await response.json();
                console.log('Data received:', data);
                if (onComplete) onComplete(data);
            }
        } catch (error) {
            console.log(error)
            if (error.name === "TimeoutError") {
                console.log("Timeout: It took more than 5 seconds to get the result!");
                // this.fetchGetEDBDataMonitor(url, onComplete, onError);
            } else if (error.name === "AbortError") {
                console.log("Fetch aborted by user action (browser stop button, closing tab, etc.");
                // this.fetchGetEDBDataMonitor(url, onComplete, onError);
            } else if (error.name === "TypeError") {
                console.log("AbortSignal.timeout() method is not supported");
                if (onError) onError(error);
            } else {
                // A network error, or some other problem.
                console.log(`Error: type: ${error.name}, message: ${error.message}`);
                if (onError) onError(error);
            }
            // console.log('There was a problem with the fetch operation:', error);
            // if(onError) onError(error);
        }
    }
    
}

const apiService = new ApiService();
export default apiService;