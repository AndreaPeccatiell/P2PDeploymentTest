import decode from 'jwt-decode';
import config from "../config.json";

const Environment = config.Environment;

class UtilsWrap {
  getCurrentEnv() {
    if (process.env.APP_ENV) return process.env.APP_ENV;
    // Production
    if (
      window.location.hostname.includes('prod')
      || window.location.hostname === ''
      || window.location.hostname === 'p2pimageprocess.lilly.com'
    ) {
      return 'prod';
    }
    // Staging
  
    // Develop
    return 'dev';
  }

  getEnvVars() {
    const env = 'dev';
    const envVariables = Object.assign({}, Environment);
    return envVariables[env];
  }

  decodeJWT(token) {
    console.log('utils token ', token)
    return decode(token);
  }

  hasSpecialCharacters(filename) {
    // Regular expression to match any character other than letters, numbers, underscores, and periods
    var regex = /[^\w.]/;

    // Test the filename against the regular expression
    return regex.test(filename);
  }

  setCookie(cookieName, cookieValue, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  }

  getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
      var c = cookieArray[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setSession(cookieName, cookieValue) {
    sessionStorage.setItem(cookieName, cookieValue);
  }

  getSession(cookieName) {
    return sessionStorage.getItem(cookieName);
  }

  checkAndGetCookie() {
    !this.getCookie("filesubmit") && this.setCookie("filesubmit", JSON.stringify({ dropFileName: [] }), 1);
    return this.getCookie("filesubmit") && JSON.parse(this.getCookie("filesubmit"));
  }

  checkAndGetSession() {
    !this.getSession("filesubmit") && this.setSession("filesubmit", JSON.stringify({ dropFileName: [] }), 1);
    return this.getSession("filesubmit") && JSON.parse(this.getSession("filesubmit"));
  }

  getUniqueTimeStamp() {
    // Create a new Date object
    var currentDate = new Date();

    // Format the date components
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    var day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');
    var milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');

    // Create a unique timestamp format (e.g., YYYY-MM-DD-HH-mm-ss-SSS)
    var uniqueTimestamp = year + '-' + month + '-' + day + '-' + hours + '-' + minutes + '-' + seconds + '-' + milliseconds;

    console.log(uniqueTimestamp);
    return uniqueTimestamp
  }

  splitFilename(filename) {
    var lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // No extension found
      return [filename, ""];
    } else {
      // Split into basename and extension
      var basename = filename.substring(0, lastDotIndex);
      var extension = filename.substring(lastDotIndex + 1);
      return [basename, extension];
    }
  }

  findIndex(arr, str) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        return i; // Return the index if the string is found
      }
    }
    return -1; // Return -1 if the string is not found
  }

  removeIntersection(arr1, arr2) {
    // Filter out elements from arr1 that are present in arr2
    return arr1.filter(function (element) {
      return !arr2.includes(element);
    });
  }

  mergeArraysByKey(arr1, arr2, key) {
    // Create a map to store elements from arr1 by key
    const map = new Map();
    arr1.forEach(item => {
      map.set(item[key], item);
    });

    arr1 = arr1.map(item => {
      item['report'] = [...new Set([...item['report']])];
      item['bill'] = [...new Set([...item['bill']])];
      return item;
    });

    // Merge elements from arr2 into the map based on the key
    arr2.forEach(item => {
      const keyValue = item[key];
      if (map.has(keyValue)) {
        // Merge properties from arr2 into arr1 element
        // Object.assign(map.get(keyValue), item);
        let newItem = map.get(keyValue)
        newItem['report'] = [...new Set([...newItem['report'], ...item['report']])];
        newItem['bill'] = [...new Set([...newItem['bill'], ...item['bill']])];
        Object.assign(map.get(keyValue), newItem);
        console.log(item)
        console.log(keyValue)
        console.log(newItem)
      } else {
        // If key not found in arr1, add it
        map.set(keyValue, item);
      }
    });

    // Convert map values back to an array
    return Array.from(map.values());
  }
}

const Utils = new UtilsWrap()
export default Utils;
