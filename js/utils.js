// ================= FUNÇÕES GERAIS =================
function checkApiUrl(apiUrl, placeholderText, serviceName) {
    if (!apiUrl || apiUrl === placeholderText) {
        errorElement.textContent = `ERRO: A URL do serviço de ${serviceName} ainda não foi configurada.`;
        return false;
    }
    return true;
}

function clearMessages() {
    statusElement.textContent = '';
    errorElement.textContent = '';
}