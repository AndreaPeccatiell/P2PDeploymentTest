import Utils from "../Common/Utils";
import axios from "axios";
//"https://t0vy9im217.execute-api.us-east-2.amazonaws.com/Dev",
//https://86glyek36a.execute-api.us-east-2.amazonaws.com/Learning
class ApiService {
    // async getBearerToken() {
    //     const token = await AuthProviderService.getAccessToken();
    //     console.log("token ", token)
    //     const headers = new Headers({
    //         'Authorization': `Bearer ${token}`,
    //     });
    //     return headers
    // }

    async sendChunkToLambda(url, chunk, fileName, partNumber, getUniqueTimeStampStr) {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('fileName', fileName);
        formData.append('partNumber', partNumber);
        formData.append('getUniqueTimeStampStr', getUniqueTimeStampStr);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                return { error: new Error('Network response was not ok') }
                //if(onError) onError(new Error('Network response was not ok'));    
                //throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log('Data received:', data);
                let body = JSON.parse(data.response.body)
                let upload_id = body.upload_id || ""
                return upload_id
                // if(onComplete) onComplete(data);   
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return { error: 'There was a problem with the fetch operation' }
            // if(onError) onError(error);
        }
    }

    async fetchGetData(url, filename, uniqueTimestampStr, files, currentVal, count, onComplete, onError, nextSplit) {
        try {
            const response = await fetch(`${url}`, {
                signal: AbortSignal.timeout(1000 * 4)
            })
            if (!response.ok) {
                if (onError) onError(new Error('Network response was not ok'));
                //   throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log('Data received:', data);
                // if (onComplete) onComplete(data);
                if (nextSplit) nextSplit(files, currentVal, count, onComplete, onError, data);
            }
        } catch (error) {
            console.log(error)
            if (error.name === "TimeoutError") {
                console.log("Timeout: It took more than 5 seconds to get the result!");
                this.retryProcessMonitor(filename, uniqueTimestampStr, onComplete, onError, files, currentVal, count, nextSplit);
            } else if (error.name === "AbortError") {
                console.log("Fetch aborted by user action (browser stop button, closing tab, etc.");
                this.retryProcessMonitor(filename, uniqueTimestampStr, onComplete, onError, files, currentVal, count, nextSplit);
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

    async fetchGetDataMonitor(url, filename, uniqueTimestampStr, files, currentVal, count, onComplete, onError, onCompleteRetry, onErrorRetry, nextSplit) {
        try {
            const response = await fetch(`${url}`, {
                signal: AbortSignal.timeout(1000 * 4)
            })
            if (!response.ok) {
                if (onError) onError(new Error('Network response was not ok'));
                //   throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log('Data fetchGetDataMonitor:', data);
                if (onCompleteRetry) onCompleteRetry(data, filename, uniqueTimestampStr, files, currentVal, count, onComplete, onError, nextSplit);
                // if (nextSplit) nextSplit(files, currentVal, count, onComplete, onError);
            }
        } catch (error) {
            console.log(error)
            if (onErrorRetry) onErrorRetry(error);
        }
    }

    retryProcessMonitor(filename, uniqueTimestampStr, onComplete, onError, files, currentVal, count, nextSplit) {
        const env = Utils.getEnvVars();
        let endpoint = env.API_URL;
        let innerurl = endpoint + "/process_monitor";
        const queryParams = {
            filename: filename
            , uniqueTimestampStr: uniqueTimestampStr
        };
        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
        if (queryString) innerurl = `${innerurl}?${queryString}`
        let that = this;
        this.fetchGetDataMonitor(innerurl, filename, uniqueTimestampStr, files, currentVal, count, onComplete, onError, function (data, filename, uniqueTimestampStr, files, currentVal, count, onComplete, onError, nextSplit) {
            console.log('Data received:', data);
            if (data.res && data.res.status) {
                console.log("if retry")
                if (data.res.res.match(/Error/gi)) {
                    console.log("if retry error")
                    if (onError) onError(data.res.res)
                } else {
                    console.log("else retry")
                    that.retryProcessMonitor(filename, uniqueTimestampStr, onComplete, onError, files, currentVal, count, nextSplit);
                }
            } else {
                console.log("else nextsplit")
                // if (onComplete) onComplete(data)
                if (nextSplit) nextSplit(files, currentVal, count, onComplete, onError);
            }
        }, function (error) {
            console.log("fetch error")
            if (onError) onError(error)
        }, nextSplit);
    }

    async fetchDownloadDataXL(url, fName, onComplete, onError) {
        await fetch(`${url}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const url = data.url;
                // const link = document.createElement('a');
                // link.href = url;
                // link.setAttribute('download', fName);
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
                // window.URL.revokeObjectURL(url);
                // if (onComplete) onComplete();
                const win = window.open(url, '_blank'); // Open the download URL in a new tab
                win.focus(); // Optional: Focus the new tab
                if (onComplete) onComplete();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
                if (onError) onError(error);
            });
    }

    async fetchDownloadData(url, oName, onComplete, onError) {
        await fetch(`${url}`)
            .then(response => response.blob())
            .then(blob => {
                console.log(blob)
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', oName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (onComplete) onComplete(blob);
            })
            .catch(error => {
                console.error('Error:', error)
                if (onError) onError(error);
            });
    }

    async fetchPostData(url, formData, onComplete, onError) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                if (onError) onError(new Error('Network response was not ok'));
                //   throw new Error('Network response was not ok');
            } else {
                const data = await response.json();
                console.log('Data received:', data);
                if (onComplete) onComplete(data);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            if (onError) onError(error);
        }
    }
}

const apiService = new ApiService();
export default apiService;