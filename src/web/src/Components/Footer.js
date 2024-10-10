// import axios from "axios";
// import Utils from "../Common/Utils";
import "../Styles/Footer.css"
// import AuthProviderService from "../Services/AuthProviderService";

const Footer = ({ initLoad,notFound }) => {
//   const eventHandler = async(e) => {
//     console.log("eent")
//     // const { accessToken } = await AuthProviderService.getAccessToken();
//     // const accessToken= await AuthProviderService.getGatewayAccessToken();
//     // console.log("gateway" ,accessToken)
//     const authClaim = await AuthProviderService.getClaims();
//     // const bearer = "Bearer " + authClaim.idToken;
//     // let headersList = {
//     //   "Authorization": `${authClaim.idToken}`
//     // };
//     const env = Utils.getEnvVars();
//     let endpoint = env.API_URL;
//     let url = endpoint + "/fetch_raw";
//     console.log(url)


//     // const url = 'https://api.example.com/your-endpoint'; // Replace with the actual API endpoint URL
//     // const origin = endpoint;//'https://dev.inext.lilly.com';  // Replace with your domain
    
//     // const request = new Request(url, {
//     //   method: 'GET', // Adjust method as needed (POST, PUT, DELETE, etc.)
//     //   // credentials: 'include', // Include credentials if necessary for authentication/authorization
//     //   headers: {
//     //     'Origin': origin,
//     //     'Referer': origin,
//     //     "Authorization": "Bearer " +authClaim.idToken
//     //   }
//     // });

//     let headersList = {
//  "Authorization": "Bearer " +authClaim.idToken,
//  'Content-Type': 'application/json'  
// }
// // const options = {
// //           method: "GET"
// //     };
// // credentials: 'include',
//     url = "https://iw38qlyhdc.execute-api.us-east-2.amazonaws.com/Dev/reportingdata"
//     const options = {
//       url: url,
//       method: "GET",
//       headers: headersList
// };
// const response = await axios.request(options);
//   // let res = await  fetch(url,options)
//   console.log("final res",response)
//   // .then(response => response.json()) // Parse response as JSON if applicable
//   // .then(data => {
//   //   console.log('API response:', data);
//   //   // Process the API response data
//   // })
//   // .catch(error => {
//   //   console.error('Error fetching data:', error);
//   //   // Handle errors (e.g., network issues, CORS errors)
//   // });
    
// // let headersList = {
// //  "Authorization": "Bearer " +authClaim.idToken
// // }
// // const options = {
// //           method: "GET"
// //     };

// //     const options = {
// //       credentials: 'include',
// //       method: "GET",
// //       headers: headersList
// // };

// //     let reqOptions = {
// //       url: url,
// //       method: "GET",
// //       headers: headersList,
// //     }
// // let response = await axios.request(reqOptions);
// // console.log(response.data);

//     // const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
 
//     // const response = await fetch(graphEndpoint, options);
//     // const data = await response.json();
//     // console.log("footer data ",data)

    
 
//     // const responsefinal = await fetch(url, options);
//     // const datafinal = await responsefinal.json();
//     // let response = await fetch(url, options);
    
//     // let data = await response.text();
//     // console.log(data);   
//  }
// //   const getHandler = () => {
// //     console.log("get handler")
    
// // //     axios.get(url)
// // // .then(response => {
// // // const data = response.data;
// // // console.log('API response:', data);
// // // })
// // // .catch(error => {
// // // console.error('Error fetching data:', error);
// // // });
// // };

    return (
        <div className="footer-container">
          <div className="text">
            Copyright © 2024 Eli Lilly and Company and its affiliates. All rights reserved.
            {/* <button onClick={eventHandler}>get axios</button> */}
          </div>
        </div>
    )
}

export default Footer;