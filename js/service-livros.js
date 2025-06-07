import { checkApiUrl, clearMessages } from './utils.js';

// O nome da função aqui deve ser o mesmo que você usa no 'import' do main.js
export function initLivroService(apiUrl, elements) {

    // --- FUNÇÕES DE LÓGICA ---

    // Esta função agora usa os parâmetros 'apiUrl' e 'elements'
    async function listarLivros() {
        clearMessages();
        if (!checkApiUrl(apiUrl, 'Livros')) return;
        
        elements.listElement.textContent = 'Buscando...';
        try {
            const response = await fetch(`${apiUrl}/livros`);
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            const data = await response.json();
            elements.listElement.textContent = data.length > 0 ? JSON.stringify(data, null, 2) : 'Nenhum livro encontrado.';
        } catch (error) {
            elements.listElement.textContent = 'Falha ao buscar dados.';
            document.getElementById('error').textContent = error.message;
        }
    }

    // --- ANEXANDO EVENTOS AOS ELEMENTOS ---

    // Anexa a função ao botão de listar
    elements.listarBtn.addEventListener('click', listarLivros);

    // Anexa ao formulário de buscar por ID
    elements.formBuscar.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();
        if (!checkApiUrl(apiUrl, 'Livros')) return;
        
        const livroId = document.getElementById('livro-id-buscar').value;
        elements.listElement.textContent = 'Buscando...';
        try {
            const response = await fetch(`${apiUrl}/livros/${livroId}`);
            if (!response.ok) throw new Error(`Erro: ${response.status} (Livro não encontrado)`);
            const data = await response.json();
            elements.listElement.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            elements.listElement.textContent = `Falha ao buscar livro com ID ${livroId}.`;
            document.getElementById('error').textContent = error.message;
        }
    });

    // Anexa ao formulário de verificar disponibilidade
    elements.formDisponibilidade.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();
        elements.resultadoDisponibilidadeElement.textContent = 'Verificando...';
        if (!checkApiUrl(apiUrl, 'Livros')) return;
        
        const livroId = document.getElementById('livro-id-disponibilidade').value;
        try {
            const response = await fetch(`${apiUrl}/livros/${livroId}`);
            if (response.status === 404) throw new Error(`Livro com ID ${livroId} não foi encontrado.`);
            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
            
            const data = await response.json();
            if (data.disponivel) {
                elements.resultadoDisponibilidadeElement.textContent = `✅ O livro "${data.titulo}" (ID: ${data.id}) ESTÁ disponível.`;
            } else {
                elements.resultadoDisponibilidadeElement.textContent = `❌ O livro "${data.titulo}" (ID: ${data.id}) NÃO ESTÁ disponível.`;
            }
        } catch (error) {
            elements.resultadoDisponibilidadeElement.textContent = 'Falha ao verificar.';
            document.getElementById('error').textContent = error.message;
        }
    });

    // Anexa ao formulário de cadastro
    elements.formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();
        if (!checkApiUrl(apiUrl, 'Livros')) return;

        const novoLivro = {
            id: document.getElementById('livro-id').value,
            titulo: document.getElementById('livro-titulo').value,
            autor: document.getElementById('livro-autor').value,
            anoPublicacao: parseInt(document.getElementById('livro-ano').value),
            quantidade: parseInt(document.getElementById('livro-quantidade').value) 
        };
        try {
            const response = await fetch(`${apiUrl}/livros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoLivro)
            });
            if (!response.ok) throw new Error(`Erro ${response.status}`);
            document.getElementById('status').textContent = `Livro "${novoLivro.titulo}" cadastrado com sucesso!`;
            elements.formCadastro.reset();
            await listarLivros();
        } catch (error) {
            document.getElementById('error').textContent = `Falha ao cadastrar livro: ${error.message}`;
        }
    });
}