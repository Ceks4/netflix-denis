const CHAVE_USUARIOS = "bizarreflixUsuarios";
const CHAVE_SESSAO = "bizarreflixSessao";

const contaTeste = {
    nome: "Jotaro Kujo",
    genero: "masculino",
    nascimento: "1970-02-20",
    email: "jotaro@bizarreflix.com",
    senha: "oraora123"
};

const botaoEntrar = document.getElementById("botaoEntrar");
const botaoCadastro = document.getElementById("botaoCadastro");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const mensagemFormulario = document.getElementById("mensagemFormulario");

function lerUsuarios(){
    try{
        return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    }catch{
        return [];
    }
}

function salvarUsuarios(usuarios){
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function iniciarContaTeste(){
    const usuarios = lerUsuarios();
    const existe = usuarios.some(usuario => usuario.email === contaTeste.email);

    if(!existe){
        usuarios.push(contaTeste);
        salvarUsuarios(usuarios);
    }
}

function mostrarMensagem(texto, sucesso = false){
    mensagemFormulario.textContent = texto;
    mensagemFormulario.classList.toggle("sucesso", sucesso);
}

function trocarFormulario(tipo){
    const entrando = tipo === "entrar";

    formLogin.style.display = entrando ? "block" : "none";
    formCadastro.style.display = entrando ? "none" : "block";
    botaoEntrar.classList.toggle("opcaoAtiva", entrando);
    botaoCadastro.classList.toggle("opcaoAtiva", !entrando);
    mostrarMensagem("");
}

function abrirCatalogo(usuario){
    const sessao = {
        nome: usuario.nome,
        email: usuario.email,
        conectadoEm: new Date().toISOString()
    };

    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    window.location.href = "catalogo.html";
}

botaoEntrar.addEventListener("click", () => trocarFormulario("entrar"));
botaoCadastro.addEventListener("click", () => trocarFormulario("cadastro"));

formLogin.addEventListener("submit", function(event){
    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value;
    const usuario = lerUsuarios().find(item => item.email === email && item.senha === senha);

    if(!usuario){
        mostrarMensagem("Email ou senha incorretos.");
        return;
    }

    mostrarMensagem("Login feito. Abrindo o catálogo...", true);
    abrirCatalogo(usuario);
});

formCadastro.addEventListener("submit", function(event){
    event.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const genero = document.getElementById("generoCadastro").value;
    const nascimento = document.getElementById("nascimentoCadastro").value;
    const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
    const senha = document.getElementById("senhaCadastro").value;
    const confirmarSenha = document.getElementById("confirmarSenhaCadastro").value;
    const usuarios = lerUsuarios();

    if(senha.length < 6){
        mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");
        return;
    }

    if(senha !== confirmarSenha){
        mostrarMensagem("As senhas não são iguais.");
        return;
    }

    if(usuarios.some(usuario => usuario.email === email)){
        mostrarMensagem("Esse email já está cadastrado.");
        return;
    }

    const novoUsuario = {nome, genero, nascimento, email, senha};
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    mostrarMensagem("Conta criada. Abrindo o catálogo...", true);
    abrirCatalogo(novoUsuario);
});

iniciarContaTeste();
