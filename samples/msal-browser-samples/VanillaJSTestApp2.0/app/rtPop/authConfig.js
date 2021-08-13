// Config object to be passed to Msal on creation
const msalConfig = {
    auth: {
        clientId: "bc77b0a7-16aa-4af4-884b-41b968c9c71a",
        authority: "https://login.microsoftonline.com/5d97b14d-c396-4aee-b524-c86d33e9b660"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {	
                    return;	
                }
                switch (level) {	
                    case msal.LogLevel.Error:	
                        console.error(message);	
                        return;	
                    case msal.LogLevel.Info:	
                        console.info(message);	
                        return;	
                    case msal.LogLevel.Verbose:	
                        console.debug(message);	
                        return;	
                    case msal.LogLevel.Warning:	
                        console.warn(message);	
                        return;	
                }
            },
            logLevel: msal.LogLevel.Verbose
        }
    }
};

// RT PoP Test Slice params
const extraQueryParams = {
    dc: "ESTS-PUB-WUS2-AZ1-TEST1"
};

const tokenQueryParams = {
    slice: "TestSlice&dc=ESTS-PUB-WUS2-AZ1-TEST1"
}

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
    scopes: ["User.Read"],
    extraQueryParameters: extraQueryParams,
    tokenQueryParameters: tokenQueryParams
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft-ppe.com/v1.0/me/messages"
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
    scopes: ["Mail.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

const silentRequest = {
    scopes: ["openid", "profile", "User.Read", "Mail.Read"]
};

const logoutRequest = {}
