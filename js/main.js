const DOM_ELEMENTS = {
    usuarios: {
        userListElement: document.getElementById('lista-usuarios'),
        formUsuarioCadastro: document.getElementById('form-usuario-cadastro'),
        formUsuarioRemocao: document.getElementById('form-usuario-remocao'),
        formUsuarioSaldo: document.getElementById('form-usuario-saldo'),
        formUsuarioVerificarInadimplencia: document.getElementById('form-usuario-verificar-inadimplencia'),
        statusInadimplenciaElement: document.getElementById('status-inadimplencia')
    },
    livros: {
        bookListElement: document.getElementById('lista-livros'),
        formLivroCadastro: document.getElementById('form-livro-cadastro'),
        formLivroBuscar: document.getElementById('form-livro-buscar'),
        formLivroDisponibilidade: document.getElementById('form-livro-disponibilidade'),
        resultadoDisponibilidadeElement: document.getElementById('resultado-disponibilidade')
    },
    pagamento: {
        paymentListElement: document.getElementById('lista-pagamentos'),
        formPagamentoExecutar: document.getElementById('form-pagamento-executar'),
        formPagamentoCancelar: document.getElementById('form-pagamento-cancelar')
    },
    aluguel: {
        aluguelListElement: document.getElementById('lista-alugueis'),
        formAluguelCriar: document.getElementById('form-aluguel-criar')
    }
};

const API_URLS = {
    usuarios: 'https://servico-usuarios-production.up.railway.app',
    livros: 'https://miocroservice-books-production.up.railway.app',
    aluguel: 'URL_DO_SERVICO_DE_ALUGUEL_AQUI',
    pagamento: 'https://microsservico-pagamento.onrender.com'
};

document.addEventListener('DOMContentLoaded', () => {
    initUsuarioService(API_URLS.usuarios, DOM_ELEMENTS.usuarios);
    initLivrosService(API_URLS.livros, DOM_ELEMENTS.livros);
    initPagamentoService(API_URLS.pagamento, DOM_ELEMENTS.pagamento);
    initAluguelService(API_URLS.aluguel, DOM_ELEMENTS.aluguel);
});

// ================= URLs DAS APIs =================
        //const USUARIO_API_BASE_URL = 'https://servico-usuarios-production.up.railway.app';
        //const ALUGUEL_API_BASE_URL = 'URL_DO_SERVICO_DE_ALUGUEL_AQUI';
        //const LIVRO_API_BASE_URL = 'https://miocroservice-books-production.up.railway.app';
        //const PAGAMENTO_API_BASE_URL = 'https://microsservico-pagamento.onrender.com';