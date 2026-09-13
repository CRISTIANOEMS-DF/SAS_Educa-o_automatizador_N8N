const staticData = $getWorkflowStaticData('global');
const currentTime = Math.floor(Date.now() / 1000);

const inputData = $input.first().json;
const token = inputData.accessToken || inputData.token || inputData.access_token;

// Pega o accountId correto dentro do array accounts[0].id
const accountId = inputData.accounts?.[0]?.id || staticData.accountId;

if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const payload = JSON.parse(jsonPayload);

    staticData.token = token;
    staticData.expiresAt = payload.exp;
    staticData.accountId = accountId;
}

return [{ 
    json: { 
        token: staticData.token, 
        accountId: staticData.accountId,
        expiresAt: staticData.expiresAt,
        expiresInMinutes: Math.floor((staticData.expiresAt - currentTime) / 60)
    } 
}];