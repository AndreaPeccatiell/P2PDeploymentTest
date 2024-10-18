const fs = require('fs');
const path = require('path');
const ResponseModel = require('./response.model'); // Adjust the path as necessary
const { decode } = require('jsonwebtoken');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

// Read persona config from the local file system instead of S3
const getPersonaConfig = async () => {
    const filePath = path.join(__dirname, 'config', 'personaconfig.json'); // Path to the local JSON file

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const personaConfig = JSON.parse(data);
        console.log('Local JSON Data:', personaConfig);
        return personaConfig;
    } catch (error) {
        console.error('Error fetching JSON from local file:', error);
        return [];
    }
};

const getClient = async () => {
    const tenantId = process.env.tenantId;
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;


    if (!tenantId || !clientId || !clientSecret) {
        throw new Error("TenantId, ClientId, and ClientSecret are required.");
    }
    const scopes = ['https://graph.microsoft.com/.default'];

    const tokenCredentialInstance = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(tokenCredentialInstance, { scopes });

    const graphClient = Client.initWithMiddleware({ authProvider, debugLogging: true });
    return graphClient;
};

const checkIfUserHasAtleastOneRole = async (groupIds, email) => {
    try {
        const graphClient = await getClient();
        for (const groupId of groupIds) {
            const groupMembers = await graphClient.api(`/groups/${groupId}/members`).get();
            if (groupMembers.value.some((el) => el.mail.toLowerCase() === email.toLowerCase())) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(`Error in checkIfUserHasAtleastOneRole: ${error}`);
        throw error;
    }
};

const getUserRoles = async (groupIds, email) => {
    try {
        const graphClient = await getClient();
        const groups = [];
        const groupPromise = groupIds.map((groupId) => {
            return graphClient.api(`/groups/${groupId}/members`).get().then((res) => {
                if (res.value.some((el) => el.mail.toLowerCase() === email.toLowerCase())) {
                    groups.push(groupId);
                }
            });
        });
        await Promise.all(groupPromise);
        return groups;
    } catch (error) {
        console.error(`Error in getUserRoles: ${error}`);
        throw error;
    }
};

exports.lambdaHandler = async function (event) {
    let response;
    console.info("EVENT\n" + JSON.stringify(event, null, 2));

    const queryParams = event.queryStringParameters;
    console.log("Query Parameters: ", queryParams);

    let body;
    try {
        // Parse the body of the event (the request payload)
        body = JSON.parse(event.body);

        if (body.claimtoken) {
            const decodedToken = decode(body.claimtoken);
            if (!decodedToken) {
                console.error('Failed to decode token');
                response = new ResponseModel(401, 'Invalid token', {});
                return response;
            }

            const email = decodedToken.unique_name || decodedToken.preferred_username;
            if (!email) {
                response = new ResponseModel(401, 'Invalid token: email missing', {});
                return response;
            }

            const personaConfig = await getPersonaConfig();
            if (!personaConfig || personaConfig.length === 0) {
                response = new ResponseModel(500, 'Failed to load persona configuration', {});
                return response;
            }

            const appGroupIds = personaConfig.map((el) => el.groupId);
            const groupsAssigned = await getUserRoles(appGroupIds, email);

            if (groupsAssigned.length < 1) {
                response = new ResponseModel(401, 'You do not have access to the application', {});
                return response;
            }

            const rolesAssigned = personaConfig
                .filter((el) => groupsAssigned.includes(el.groupId))
                .map((val) => ({ rolename: val.roleName, access: val.access.join(',') }));

            response = new ResponseModel(200, 'Roles fetched Successfully', {
                email,
                roles: rolesAssigned
            });
            return response;
        } else {
            response = new ResponseModel(401, 'You do not have access to the application', {});
            return response;
        }
    } catch (error) {
        console.error("Error:", error);
        response = new ResponseModel(500, 'Internal server error', {});
        return response;
    }
};
