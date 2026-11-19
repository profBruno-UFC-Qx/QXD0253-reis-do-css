const API_URL = "https://literate-goggles-97qv499rj6pw2p4rw-1337.app.github.dev/api";

const CONTAS_TESTE = [
    { nome: "Usuário Teste", email: "usuario@teste.com", senha: "123456",   tipo: "comum" },
    { nome: "Administrador", email: "admin@teste.com",   senha: "admin123", tipo: "admin" },
];

try { localStorage.removeItem("usuario"); } catch {}

const form = document.getElementById("form-login");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const msgErro = document.getElementById("msg-erro");

function mostrarErro(texto, campos = []) {
    msgErro.textContent = texto;
    msgErro.hidden = false;
    [campoEmail, campoSenha].forEach(c => c.classList.remove("invalido"));
    campos.forEach(c => c.classList.add("invalido"));
}

function limparErro() {
    msgErro.hidden = true;
    [campoEmail, campoSenha].forEach(c => c.classList.remove("invalido"));
}

function entrarComContaTeste(email, senha) {
    const conta = CONTAS_TESTE.find(c => c.email === email && c.senha === senha);
    if (!conta) return false;

    sessionStorage.setItem("usuario", JSON.stringify({
        nome: conta.nome,
        email: conta.email,
        tipo: conta.tipo,
    }));

    location.href = conta.tipo === "admin" ? "Admin.html" : "index.html";
    return true;
}

form.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    limparErro();

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (!email || !senha) {
        mostrarErro("Preencha e-mail e senha.", [!email ? campoEmail : campoSenha]);
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identifier: email,
                password: senha,
            }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            const tipo = dados.user.email === "admin@teste.com" ? "admin" : "comum";

            sessionStorage.setItem("usuario", JSON.stringify({
                id: dados.user.id,
                nome: dados.user.username,
                email: dados.user.email,
                tipo,
                token: dados.jwt,
            }));

            location.href = tipo === "admin" ? "Admin.html" : "index.html";
            return;
        }

        if (entrarComContaTeste(email, senha)) return;

        mostrarErro("E-mail ou senha incorretos.", [campoEmail, campoSenha]);
    } catch (erro) {
        console.error("Erro na requisição de login:", erro);
        if (entrarComContaTeste(email, senha)) return;
        mostrarErro("Não foi possível conectar ao servidor.");
    }
});

campoEmail.addEventListener("input", limparErro);
campoSenha.addEventListener("input", limparErro);