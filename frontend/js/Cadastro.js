const API_URL = "https://literate-goggles-97qv499rj6pw2p4rw-1337.app.github.dev/api";

const form = document.getElementById("form-cadastro");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const campoConfirmar = document.getElementById("confirmar-senha");
const msgErro = document.getElementById("msg-erro");
const msgSucesso = document.getElementById("msg-sucesso");

function mostrarErro(texto, campos = []) {
    msgSucesso.hidden = true;
    msgErro.textContent = texto;
    msgErro.hidden = false;
    [campoNome, campoEmail, campoSenha, campoConfirmar].forEach(c => c.classList.remove("invalido"));
    campos.forEach(c => c.classList.add("invalido"));
}

function limparMensagens() {
    msgErro.hidden = true;
    msgSucesso.hidden = true;
    [campoNome, campoEmail, campoSenha, campoConfirmar].forEach(c => c.classList.remove("invalido"));
}

form.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    limparMensagens();

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;
    const confirmarSenha = campoConfirmar.value;

    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarErro("Preencha todos os campos obrigatórios.");
        return;
    }

    if (senha.length < 6) {
        mostrarErro("A senha deve ter no mínimo 6 caracteres.", [campoSenha]);
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarErro("As senhas não coincidem.", [campoSenha, campoConfirmar]);
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/auth/local/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: nome,
                email,
                password: senha,
            }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            const erroStrapi = dados?.error?.message || "";
            if (erroStrapi.includes("already taken")) {
                mostrarErro("Este e-mail ou nome de usuário já está em uso.", [campoEmail]);
            } else {
                mostrarErro(erroStrapi || "Não foi possível concluir o cadastro.");
            }
            return;
        }

        sessionStorage.setItem("usuario", JSON.stringify({
            id: dados.user.id,
            nome: dados.user.username,
            email: dados.user.email,
            tipo: "comum",
            token: dados.jwt,
        }));

        msgSucesso.textContent = "Conta criada com sucesso! Redirecionando...";
        msgSucesso.hidden = false;

        setTimeout(() => {
            location.href = "index.html";
        }, 1200);
    } catch {
        mostrarErro("Não foi possível conectar ao servidor.");
    }
});

[campoNome, campoEmail, campoSenha, campoConfirmar].forEach(campo => {
    campo.addEventListener("input", limparMensagens);
});