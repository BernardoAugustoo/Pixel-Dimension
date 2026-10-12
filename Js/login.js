const formulario = document.querySelector('#form-login');
const campoNome = document.querySelector('#nome');
const campoSenha = document.querySelector('#senha');

const botaoReferencias = document.querySelector('#botao-referencias');

formulario.addEventListener('submit', function (evento) {

    evento.preventDefault();

    const nome = campoNome.value.trim();

    if (nome === '') {
        alert('Digite seu nome!');

        campoNome.focus();
        return;
    }

    localStorage.setItem('nomeJogador', nome);

    campoSenha.value = '';

    window.location.href = 'index.html';

});

botaoReferencias.addEventListener('click', function () {

    window.location.href = 'referencias.html';

});