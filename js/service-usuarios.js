import { checkApiUrl, clearMessages } from './utils.js';

export function initUsuarioService(apiUrl, elements) {
    
    // LISTAR USUÁRIOS
    async function listarUsuarios() {
        clearMessages();
            if (!checkApiUrl(USUARIO_API_BASE_URL, 'https://servico-usuarios-production.up.railway.app', 'Usuários')) return;
            userListElement.textContent = 'Buscando...';
            try {
                const response = await fetch(`${USUARIO_API_BASE_URL}/usuarios`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                userListElement.textContent = data.length > 0 ? JSON.stringify(data, null, 2) : 'Nenhum usuário encontrado.';
            } catch (error) {
                userListElement.textContent = 'Falha ao buscar dados.';
                errorElement.textContent = error.message;
            }
    };

    // CADASTRAR USUÁRIO
    elements.formUsuarioCadastro.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(USUARIO_API_BASE_URL, 'https://servico-usuarios-production.up.railway.app', 'Usuários')) return;
            const usuario = {
                id: document.getElementById('usuario-id').value,
                nome: document.getElementById('usuario-nome').value,
                email: document.getElementById('usuario-email').value,
                telefone: document.getElementById('usuario-telefone').value,
                tipo: document.getElementById('usuario-tipo').value,
                saldoDevedor: 0.0,
                inadimplente: false
            };
            try {
                const response = await fetch(`${USUARIO_API_BASE_URL}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (response.status === 400) throw new Error(`Erro 400: Dados inválidos ou ID já existente.`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                statusElement.textContent = `Usuário "${data.nome}" (tipo: ${data.tipo}) cadastrado com sucesso!`;
                formUsuarioCadastro.reset();
                listarUsuarios();
            } catch (error) {
                errorElement.textContent = `Falha ao cadastrar: ${error.message}`;
            }
        });

    // Atualizar Saldo devedor
    elements.formUsuarioSaldo.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(USUARIO_API_BASE_URL, 'https://servico-usuarios-production.up.railway.app', 'Usuários')) return;
            const usuarioId = document.getElementById('usuario-id-saldo').value;
            const valor = parseFloat(document.getElementById('usuario-valor-saldo').value);
            try {
                const response = await fetch(`${USUARIO_API_BASE_URL}/usuarios/${usuarioId}/saldo`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ valor: valor })
                });
                if (response.status === 404) throw new Error(`Erro 404: Usuário com ID ${usuarioId} não encontrado.`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                statusElement.textContent = `Saldo do usuário ${data.nome} atualizado para R$${data.saldoDevedor.toFixed(2)}. Inadimplente: ${data.inadimplente}`;
                formUsuarioSaldo.reset();
                listarUsuarios();
            } catch (error) {
                errorElement.textContent = `Falha ao atualizar saldo: ${error.message}`;
            }
        });

    // Verificar Inadimplencia
    elements.formUsuarioVerificarInadimplencia.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            statusInadimplenciaElement.textContent = 'Verificando...';
    
            if (!checkApiUrl(USUARIO_API_BASE_URL, 'https://servico-usuarios-production.up.railway.app', 'Usuários')) {
            statusInadimplenciaElement.textContent = 'URL da API não configurada.';
            return;
            }

            const usuarioId = document.getElementById('usuario-id-inadimplencia').value;

            try {
                const response = await fetch(`${USUARIO_API_BASE_URL}/usuarios/${usuarioId}/inadimplencia`);

                if (response.status === 404) {
                    statusInadimplenciaElement.textContent = `Usuário com ID ${usuarioId} não encontrado.`;
                    throw new Error(`Erro 404: Usuário não encontrado.`);
                }
                if (!response.ok) {
                    statusInadimplenciaElement.textContent = `Erro ao verificar: ${response.status}`;
                    throw new Error(`Erro: ${response.status}`);
                }
        
                const data = await response.json();
        
                if (data.inadimplente) {
                    statusInadimplenciaElement.textContent = `O usuário ${usuarioId} ESTÁ inadimplente.`;
                } else {
                    statusInadimplenciaElement.textContent = `O usuário ${usuarioId} NÃO está inadimplente.`;
                }
        
            } catch (error) {
                console.error('Falha ao verificar inadimplência:', error.message);
            }
        });

        //Remover usuário
        formUsuarioRemocao.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(USUARIO_API_BASE_URL, 'https://servico-usuarios-production.up.railway.app', 'Usuários')) return;
            const idParaRemover = document.getElementById('usuario-id-remover').value;
            try {
                const response = await fetch(`${USUARIO_API_BASE_URL}/usuarios/${idParaRemover}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(`Erro: ${response.status}. Usuário não encontrado.`);
                statusElement.textContent = `Usuário com ID ${idParaRemover} removido com sucesso!`;
                formUsuarioRemocao.reset();
                listarUsuarios();
            } catch (error) {
                errorElement.textContent = `Falha ao remover: ${error.message}`;
            }
        });

}