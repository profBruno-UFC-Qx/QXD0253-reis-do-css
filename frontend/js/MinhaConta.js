const BASE_URL = "https://literate-goggles-97qv499rj6pw2p4rw-1337.app.github.dev";
const API_URL = `${BASE_URL}/api`;

function obterUsuarioLogado() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

const usuario = obterUsuarioLogado();
if (!usuario) {
  location.replace("login.html");
}

let meusAnuncios = [];

function formatarPreco(valor) {
  const numero = Number(valor) || 0;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterInfoStatus(statusBruto) {
  const s = String(statusBruto || "ativo").toLowerCase();
  if (s === "alugado") {
    return { classe: "status-alugado", icone: "bi-key-fill", texto: "Alugado", chave: "alugado" };
  }
  if (s === "pausado") {
    return { classe: "status-pausado", icone: "bi-pause-circle-fill", texto: "Pausado", chave: "pausado" };
  }
  return { classe: "status-ativo", icone: "bi-check-circle-fill", texto: "Ativo", chave: "ativo" };
}

function renderizarAnuncios(filtro = "todos") {
  const container = document.getElementById("lista-meus-anuncios");
  const contador = document.getElementById("contador-anuncios");
  contador.textContent = meusAnuncios.length;

  const filtrados = meusAnuncios.filter((item) => {
    if (filtro === "todos") return true;
    return obterInfoStatus(item.status_anuncio).chave === filtro;
  });

  if (filtrados.length === 0) {
    container.innerHTML = `
      <div class="estado-vazio">
        <i class="bi bi-house-slash"></i>
        <h4>Nenhum anúncio encontrado</h4>
        <p>Você ainda não possui anúncios nesta categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtrados.map((anuncio) => {
    const st = obterInfoStatus(anuncio.status_anuncio);
    const capa = anuncio.imagem
      ? `<img src="${anuncio.imagem}" alt="${anuncio.titulo}">`
      : `<i class="bi bi-house-door"></i>`;

    return `
      <article class="card-imovel-conta">
        <div class="card-imovel-topo">
          <span class="status-pill ${st.classe}">
            <i class="bi ${st.icone}"></i> ${st.texto}
          </span>
          ${capa}
        </div>
        <div class="card-imovel-corpo">
          <h4>${anuncio.titulo}</h4>
          <p class="card-imovel-local"><i class="bi bi-geo-alt me-1"></i>${anuncio.localizacao}</p>
          <div class="card-imovel-preco">${formatarPreco(anuncio.preco)} <small class="text-muted fw-normal fs-6">/mês</small></div>
          <div class="card-imovel-acoes">
            <a href="imovel.html?id=${anuncio.docId}" class="btn-card">Ver anúncio</a>
            <button type="button" class="btn-card btn-card-perigo" onclick="excluirAnuncio('${anuncio.docId}')">Excluir</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function carregarMeusAnuncios() {
  try {
    const headers = usuario.token ? { Authorization: `Bearer ${usuario.token}` } : {};
    const filtroUsuario = usuario.id ? `&filters[usuario][id][$eq]=${usuario.id}` : "";
    const resposta = await fetch(`${API_URL}/anuncios?populate=*${filtroUsuario}`, { headers });

    if (resposta.ok) {
      const json = await resposta.json();
      const lista = json.data || [];

      meusAnuncios = lista.map((item) => {
        const dados = item.attributes || item;
        const imovel = dados.imovel?.data?.attributes || dados.imovel || {};
        const listaImagens = dados.imagens?.data || dados.imagens || [];
        const primeiraImg = listaImagens[0]?.attributes || listaImagens[0];
        const urlImg = primeiraImg?.url
          ? (primeiraImg.url.startsWith("http") ? primeiraImg.url : `${BASE_URL}${primeiraImg.url}`)
          : null;

        const localizacao = imovel.bairro
          || imovel.endereco
          || imovel.cidade
          || dados.descricao
          || "Localização não informada";

        return {
          docId: item.documentId || item.id,
          titulo: dados.titulo || "Imóvel sem título",
          localizacao,
          preco: dados.preco || 0,
          status_anuncio: dados.status_anuncio || "ativo",
          imagem: urlImg,
        };
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar anúncios:", erro);
    meusAnuncios = [];
  }

  renderizarAnuncios();
}

async function excluirAnuncio(docId) {
  if (!confirm("Deseja realmente excluir este anúncio?")) return;

  try {
    const headers = usuario.token ? { Authorization: `Bearer ${usuario.token}` } : {};
    const resposta = await fetch(`${API_URL}/anuncios/${docId}`, {
      method: "DELETE",
      headers,
    });

    if (!resposta.ok) {
      alert("Não foi possível excluir o anúncio no servidor.");
      return;
    }
  } catch {
    alert("Erro de conexão ao tentar excluir o anúncio.");
    return;
  }

  meusAnuncios = meusAnuncios.filter((item) => String(item.docId) !== String(docId));
  renderizarAnuncios(document.getElementById("filtro-status-anuncio").value);
}

function obterFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(`favoritos_${usuario.email}`)) || [];
  } catch {
    return [];
  }
}

function renderizarFavoritos() {
  const favoritos = obterFavoritos();
  const container = document.getElementById("lista-favoritos");
  const contador = document.getElementById("contador-favoritos");
  contador.textContent = favoritos.length;

  if (favoritos.length === 0) {
    container.innerHTML = `
      <div class="estado-vazio">
        <i class="bi bi-heart"></i>
        <h4>Nenhum favorito salvo</h4>
        <p>Explore os imóveis na página inicial e clique no coração para salvá-los aqui.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favoritos.map((fav) => `
    <article class="card-imovel-conta">
      <div class="card-imovel-topo">
        ${fav.imagem ? `<img src="${fav.imagem}" alt="${fav.titulo}">` : `<i class="bi bi-house-heart"></i>`}
      </div>
      <div class="card-imovel-corpo">
        <h4>${fav.titulo || "Imóvel favoritado"}</h4>
        <p class="card-imovel-local"><i class="bi bi-geo-alt me-1"></i>${fav.bairro || fav.localizacao || "Localização não informada"}</p>
        <div class="card-imovel-preco">${formatarPreco(fav.preco)} <small class="text-muted fw-normal fs-6">/mês</small></div>
        <div class="card-imovel-acoes">
          <a href="imovel.html?id=${fav.id}" class="btn-card">Ver detalhes</a>
          <button type="button" class="btn-card btn-card-perigo" onclick="removerFavorito('${fav.id}')">Remover</button>
        </div>
      </div>
    </article>
  `).join("");
}

function removerFavorito(id) {
  const atualizados = obterFavoritos().filter((item) => String(item.id) !== String(id));
  localStorage.setItem(`favoritos_${usuario.email}`, JSON.stringify(atualizados));
  renderizarFavoritos();
}

function carregarPerfil() {
  const inicial = (usuario.nome || "U").charAt(0).toUpperCase();
  document.getElementById("perfil-avatar").textContent = inicial;
  document.getElementById("perfil-cabecalho-nome").textContent = usuario.nome || "Usuário";
  document.getElementById("perfil-badge-tipo").textContent = usuario.tipo === "admin" ? "Administrador" : "Conta Comum";

  document.getElementById("perfil-nome").value = usuario.nome || "";
  document.getElementById("perfil-email").value = usuario.email || "";
  document.getElementById("perfil-telefone").value = usuario.telefone || "";
  document.getElementById("perfil-cidade").value = usuario.cidade || "";
}

document.getElementById("form-perfil").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("msg-perfil");
  msg.hidden = true;

  const novoNome = document.getElementById("perfil-nome").value.trim();
  const novoEmail = document.getElementById("perfil-email").value.trim().toLowerCase();
  const novoTelefone = document.getElementById("perfil-telefone").value.trim();
  const novaCidade = document.getElementById("perfil-cidade").value.trim();

  if (!novoNome || !novoEmail) {
    msg.textContent = "Nome e e-mail são obrigatórios.";
    msg.className = "msg-feedback erro";
    msg.hidden = false;
    return;
  }

  if (usuario.id && usuario.token) {
    try {
      await fetch(`${API_URL}/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({
          username: novoNome,
          email: novoEmail,
        }),
      });
    } catch {}
  }

  const usuarioAtualizado = {
    ...usuario,
    nome: novoNome,
    email: novoEmail,
    telefone: novoTelefone,
    cidade: novaCidade,
  };

  sessionStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  Object.assign(usuario, usuarioAtualizado);
  carregarPerfil();

  msg.textContent = "Dados do perfil atualizados com sucesso!";
  msg.className = "msg-feedback sucesso";
  msg.hidden = false;
});

document.getElementById("filtro-status-anuncio").addEventListener("change", (e) => {
  renderizarAnuncios(e.target.value);
});

carregarPerfil();
carregarMeusAnuncios();
renderizarFavoritos();