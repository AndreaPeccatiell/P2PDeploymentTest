import  { AuthProvider }  from '@elilillyco/spa_auth';
import Utils from "../Common/Utils";
const env = Utils.getEnvVars();

const config = {
   clientId: "ab0165a7-85b2-4812-a46c-165413a910c6",
   scopes: env.scopes, 
   openidPostLogoutRedirectUri: "/",
   cacheLocation: "localStorage",
   logLevel: "ERROR"   
}
export const authProvider = new AuthProvider(config);