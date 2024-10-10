import  { AuthProvider }  from '@elilillyco/spa_auth';
import Utils from '../Common/Utils';
const env = Utils.getEnvVars();

const config = {
   clientId: env.clientId
}

export const graphAuthProvider = new AuthProvider(config);