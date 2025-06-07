import { checkApiUrl, clearMessages } from './utils.js';

export function initLivrosService(apiUrl, elements) {
    async function listarLivros() {
            clearMessages();
            if (!checkApiUrl(LIVRO_API_BASE_URL, 'http://miocroservice-books-production.up.railway.app', 'Livros')) return;
            bookListElement.textContent = 'Buscando...';
            try {
                const response = await fetch(`${LIVRO_API_BASE_URL}/livros`);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                bookListElement.textContent = data.length > 0 ? JSON.stringify(data, null, 2) : 'Nenhum livro encontrado.';
            } catch (error) {
                bookListElement.textContent = 'Falha ao buscar dados.';
                errorElement.textContent = error.message;
            }
        }

        elements.formLivroBuscar.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(LIVRO_API_BASE_URL, 'http://miocroservice-books-production.up.railway.app', 'Livros')) return;
            const livroId = document.getElementById('livro-id-buscar').value;
            bookListElement.textContent = 'Buscando...';
            try {
                const response = await fetch(`${LIVRO_API_BASE_URL}/livros/${livroId}`);
                if (!response.ok) throw new Error(`Erro: ${response.status} (Livro não encontrado)`);
                const data = await response.json();
                bookListElement.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                bookListElement.textContent = `Falha ao buscar livro com ID ${livroId}.`;
                errorElement.textContent = error.message;
            }
        });

        elements.formLivroDisponibilidade.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            resultadoDisponibilidadeElement.textContent = 'Verificando...';
            if (!checkApiUrl(LIVRO_API_BASE_URL, 'URL_DO_SERVICO_DE_LIVROS_AQUI', 'Livros')) {
                resultadoDisponibilidadeElement.textContent = 'URL da API de Livros não configurada.';
                return;
            }
            const livroId = document.getElementById('livro-id-disponibilidade').value;
            try {
                const response = await fetch(`${LIVRO_API_BASE_URL}/livros/${livroId}`);
                if (response.status === 404) {
                    resultadoDisponibilidadeElement.textContent = `Livro com ID ${livroId} não foi encontrado.`;
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.status}`);
                }
                const data = await response.json();
                if (data.disponivel) {
                    resultadoDisponibilidadeElement.textContent = `✅ O livro "${data.titulo}" (ID: ${data.id}) ESTÁ disponível.`;
                } else {
                    resultadoDisponibilidadeElement.textContent = `❌ O livro "${data.titulo}" (ID: ${data.id}) NÃO ESTÁ disponível.`;
            }
            } catch (error) {
                resultadoDisponibilidadeElement.textContent = `Falha ao verificar disponibilidade.`;
                errorElement.textContent = error.message; // Exibe o erro técnico no campo de erro global
                console.error('Erro detalhado:', error);
            }
        });

        elements.formLivroCadastro.addEventListener('submit', async (event) => {
            event.preventDefault(); clearMessages();
            if (!checkApiUrl(LIVRO_API_BASE_URL, 'http://miocroservice-books-production.up.railway.app', 'Livros')) return;
            const novoLivro = {
                id: document.getElementById('livro-id').value,
                titulo: document.getElementById('livro-titulo').value,
                autor: document.getElementById('livro-autor').value,
                anoPublicacao: parseInt(document.getElementById('livro-ano').value),
                quantidade: parseInt(document.getElementById('livro-quantidade').value) 
        };
            try {
                const response = await fetch(`${LIVRO_API_BASE_URL}/livros`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoLivro)
                });
                if (!response.ok) throw new Error(`Erro ${response.status}`);
                statusElement.textContent = `Livro "${novoLivro.titulo}" cadastrado com sucesso!`;
                formLivroCadastro.reset();
                listarLivros();
            } catch (error) {
                errorElement.textContent = `Falha ao cadastrar livro: ${error.message}`;
            }
        });
}