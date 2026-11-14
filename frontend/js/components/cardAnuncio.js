import { urlMidia } from "../api.js";

function criar(tag, classes, texto) {
    const elementos = document.createElement(tag);
    elementos.className = classes;
    elementos.textContent = texto;
    return elementos;
}

export function criarCardAnuncio(anuncio) {
    const item = document.createElement("li");
    const card = criar("article", "card anuncio");


    const img = criar("img", "card-img-top");
    img.src = anuncio.imagens?.[0] ? urlMidia(anuncio.imagens[0]) : "assets/sem-foto.jpg";
    img.alt = anuncio.titulo;

    const corpo = criar("div", "card-body");
    const titulo = criar("h3", "card-title", anuncio.titulo);
    const texto = criar("p", "card-text", anuncio.descricao || "");

    const preco = criar("p", "anuncio-preco", `R$ ${Number(anuncio.preco).toLocaleString("pt-BR")} `);
    preco.appendChild(criar("span", "", "/mês"));

    const link = criar("a", "btn-detalhes", "Ver detalhes");
    link.href = `detalhes.html?id=${encodeURIComponent(anuncio.documentId)}`;

    corpo.append(titulo, texto, preco, link);
    card.append(img, corpo);
    item.append(card);

    return item;

}