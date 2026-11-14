import { request, uploadArquivos } from "../api.js";

const POPULATE = "populate[imovel]=true&populate[imagens]=true";

export async function buscarAnuncio(id) {
    const res = await request(`/anuncios/${id}?${POPULATE}`, { auth: false });
    if (!res?.data) throw new Error("Anúncio não encontrado.");
    return res.data;
}

//Aplica os fuitros do usuario na busca
export async function listarAnuncios(filtros = {}, pagina = 1) {
    const params = new URLSearchParams();

    params.set("filters[status_anuncio][$eq]", "ativo");
    params.set("populate[imovel]", "true");
    params.set("populate[imagens]", "true");

    if (filtros.busca) {
        params.set("filters[$or][0][titulo][$containsi]", filtros.busca)
        params.set("filters[$or][1][descricao][$containsi]", filtros.busca)
        params.set("filters[$or][2][imovel][bairro][$containsi]", filtros.busca)
    }

    if (filtros.precoMax) params.set("filters[preco][$lte]", filtros.precoMax);
    if (filtros.tipo) params.set("filters[imovel][tipo][$eq]", filtros.tipo);
    if (filtros.quartos) params.set("filters[imovel][qtd_quartos][$gte]", filtros.quartos);
    if (filtros.banheiros) params.set("filters[imovel][qtd_banheiros][$gte]", filtros.banheiros);
    if (filtros.aceitaPets) params.set("filters[imovel][aceita_pets][$eq]", "true");
    if (filtros.mobiliado) params.set("filters[imovel][mobiliado][$eq]", "true");

    //define a paginação da busca
    params.set("pagination[page]", pagina);
    params.set("pagination[pageSize]", 12);

    // Ordena os resultados
    const ordenacoes = {
    recentes: "createdAt:desc",
    menor_preco: "preco:asc",
    maior_preco: "preco:desc",
    };

    params.set("sort[0]", ordenacoes[filtros.ordem] ?? "createdAt:desc");
    params.set("sort[1]", "id:desc");
    
    const res = await request(`/anuncios?${params}`, { auth: false });

    return { anuncios: res.data, paginacao: res.meta.pagination };
}

export async function listarMeusAnuncios(usuarioId) {
const params = new URLSearchParams();
params.set("filters[usuario][id][$eq]", usuarioId);
params.set("populate[imovel]", "true");
params.set("populate[imagens]", "true");
params.set("sort", "createdAt:desc");

const res = await request(`/anuncios?${params}`);
return res.data;
}

export async function enviarFotos(arquivos) {
    const enviadas = await uploadArquivos(arquivos);
    return enviadas.map((f) => f.id);
}

export async function criarAnuncio(anuncio, idsImagens, imovelDocumentId, usuarioId) {
    const corpo = {
        titulo: anuncio.titulo,
        descricao: anuncio.descricao || null,
        preco: Number(anuncio.preco),
        imagens: idsImagens,
        status_anuncio: "ativo",
        imovel: imovelDocumentId,
        usuario: usuarioId,
    };

    const res = await request("/anuncios?status=published", {
        method: "POST",
        body: { data: corpo },
    });

    return res.data;
}

export async function atualizarAnuncio(id, anuncio, idsImagens) {
    const corpo = {
        titulo: anuncio.titulo,
        descricao: anuncio.descricao || null,
        preco: Number(anuncio.preco),
        imagens: idsImagens,
    };

    const res = await request(`/anuncios/${id}?status=published`, {
        method: "PUT",
        body: { data: corpo },
    });
    return res.data;
}

export async function alterarStatusAnuncio(id, status) {
    const res = await request(`/anuncios/${id}?status=published`, {
        method: "PUT",
        body: { data: { status_anuncio: status } },
    });
    return res.data;
}

export async function excluirAnuncio(id) {
    await request(`/anuncios/${id}`, { method: "DELETE" });
}
