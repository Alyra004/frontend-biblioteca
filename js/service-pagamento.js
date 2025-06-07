import { checkApiUrl, clearMessages } from './utils.js';

export function initPagamentoService(apiUrl, elements) {

    async function listarFormasPagamento() {
            clearMessages();
            if (!checkApiUrl(PAGAMENTO_API_BASE_URL, 'https://microsservico-pagamento.onrender.com', 'Pagamento')) return;
            paymentListElement.textContent = 'Buscando...';
            try {
                const response = await fetch(`${PAGAMENTO_API_BASE_URL}/pagamentos`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                paymentListElement.textContent = data.length > 0 ? JSON.stringify(data, null, 2) : 'Nenhuma forma de pagamento encontrada.';
            } catch (error) {
                paymentListElement.textContent = 'Falha ao buscar dados.';
                errorElement.textContent = error.message;
            }
        }

        elements.formPagamentoExecutar.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(PAGAMENTO_API_BASE_URL, 'https://microsservico-pagamento.onrender.com', 'Pagamento')) return;
            const novoPagamento = {
                usuarioId: document.getElementById('pagamento-usuario-id').value,
                valor: parseFloat(document.getElementById('pagamento-valor').value),
                metodo: document.getElementById('pagamento-metodo').value
            };
            try {
                const response = await fetch(`${PAGAMENTO_API_BASE_URL}/pagamentos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoPagamento)
                });
                if (!response.ok) throw new Error(`Erro ${response.status}`);
                const data = await response.json();
                statusElement.textContent = `Pagamento (ID: ${data.id}) de R$${data.valor} efetuado com sucesso!`;
                formPagamentoExecutar.reset();
            } catch (error) {
                errorElement.textContent = `Falha ao executar pagamento: ${error.message}`;
            }
        });

        elements.formPagamentoCancelar.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(PAGAMENTO_API_BASE_URL, 'https://microsservico-pagamento.onrender.com', 'Pagamento')) return;
            const pagamentoId = document.getElementById('pagamento-id-cancelar').value;
            try {
                const response = await fetch(`${PAGAMENTO_API_BASE_URL}/pagamentos/${pagamentoId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(`Erro ${response.status}`);
                statusElement.textContent = `Pagamento com ID ${pagamentoId} cancelado com sucesso!`;
                formPagamentoCancelar.reset();
            } catch (error) {
                errorElement.textContent = `Falha ao cancelar pagamento: ${error.message}`;
            }
        });
}