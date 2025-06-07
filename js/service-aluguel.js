import { checkApiUrl, clearMessages } from './utils.js';

export function initAluguelService(apiUrl, elements) {
    async function listarAlugueis() {
            clearMessages();
            if (!checkApiUrl(ALUGUEL_API_BASE_URL, 'URL_DO_SERVICO_DE_ALUGUEL_AQUI', 'Aluguel')) return;
            aluguelListElement.textContent = 'Buscando...';
            try {
                const response = await fetch(`${ALUGUEL_API_BASE_URL}/alugueis`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                aluguelListElement.textContent = data.length > 0 ? JSON.stringify(data, null, 2) : 'Nenhum aluguel encontrado.';
            } catch (error) {
                aluguelListElement.textContent = 'Falha ao buscar dados.';
                errorElement.textContent = error.message;
            }
        }
        
        elements.formAluguelCriar.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(ALUGUEL_API_BASE_URL, 'URL_DO_SERVICO_DE_ALUGUEL_AQUI', 'Aluguel')) return;
            const novoAluguel = {
                usuarioId: document.getElementById('aluguel-usuario-id').value,
                livroId: document.getElementById('aluguel-livro-id').value,
                prazo: document.getElementById('aluguel-prazo').value
            };
            try {
                const response = await fetch(`${ALUGUEL_API_BASE_URL}/alugueis`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoAluguel)
                });
                if (!response.ok) {
                   const errorData = await response.json();
                   throw new Error(`Erro ${response.status}: ${errorData.mensagem || 'Erro desconhecido'}`);
                }
                statusElement.textContent = `Aluguel criado com sucesso!`;
                formAluguelCriar.reset();
                listarAlugueis();
            } catch (error) {
                errorElement.textContent = `Falha ao criar aluguel: ${error.message}`;
            }
        });
}