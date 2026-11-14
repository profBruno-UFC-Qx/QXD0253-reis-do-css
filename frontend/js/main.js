import { obterUsuario } from "./auth.js"
import { listarAnuncios } from "./services/anuncioService.js";
import { criarCardAnuncio } from "./components/cardAnuncio.js"

// Renderiza os botões de acesso caso o usuário nao esteja logado
function renderAcesso(){

    var usuario = obterUsuario()
    const container = document.getElementById("usuario-deslogado")

    if(!container) return

    return container.style.display = usuario ? "none":"flex"
}


// CONFIGURAÇÃO DAS PÁGINAS E FILTROS
const formFiltros = document.getElementById("form-busca")
const msgLista = document.getElementById("msg-lista")
const btnAnterior = document.getElementById("btn-anterior")
const btnProximo = document.getElementById("btn-proximo")
const infoPagina = document.getElementById("info-pagina")
let paginaAtual = 1
let totalPaginas = 1

function lerFiltros() {
    const f = formFiltros.elements;
    return {
        busca: f.busca.value.trim(),
        precoMax: f.precoMax.value,
        tipo: f.tipo.value,
        quartos: f.quartos.value,
        banheiros: f.banheiros.value,
        ordem: f.ordem.value,
        aceitaPets: f.aceita_pets.checked,
        mobiliado: f.mobiliado.checked,
    }
}

function atualizarPaginacao() {
    btnAnterior.disabled = paginaAtual <= 1;
    btnProximo.disabled = paginaAtual >= totalPaginas;
    document.getElementById("paginacao").hidden = totalPaginas <= 1
    infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

async function carregarAnuncios() {
    const filtros = lerFiltros();
    try {
        const { anuncios, paginacao } = await listarAnuncios(filtros, paginaAtual);
        renderAnuncios(anuncios);
        totalPaginas = Math.max(paginacao.pageCount, 1);   
        atualizarPaginacao();
    } catch (erro) {
        console.error(erro.message);
    }
}


// CONFIGURAÇÃO DOS ANÚNCIOS
const listaAnuncios = document.getElementById("lista-anuncios")

function renderAnuncios(anuncios) {
    listaAnuncios.replaceChildren();

    msgLista.hidden = anuncios.length > 0;
    msgLista.textContent = anuncios.length === 0 ? "Nenhum anúncio encontrado." : "";

    listaAnuncios.append(...anuncios.map(criarCardAnuncio));
}

formFiltros.addEventListener("submit", (e) => {
    e.preventDefault();
    paginaAtual = 1;
    carregarAnuncios();
});

formFiltros.addEventListener("reset", () => {
    setTimeout(() => {
        paginaAtual = 1;
        carregarAnuncios();
  });
});

btnProximo.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarAnuncios();
    }
});

btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarAnuncios();
    }
});


renderAcesso()
carregarAnuncios()
