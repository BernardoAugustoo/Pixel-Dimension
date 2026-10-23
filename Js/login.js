const formulario = document.querySelector('#form-login');
const campoNome = document.querySelector('#nome');
const campoSenha = document.querySelector('#senha');
const botaoReferencias = document.querySelector('#botao-referencias');
const painelLogin = document.querySelector('#painel-login');
const mapas = document.querySelectorAll('.mapa');

const temas = [
    'tema-minecraft',
    'tema-fortnite',
    'tema-tlou',
    'tema-hollow-knight'
];

let faseAtual = 0;

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

function trocarFase() {

    mapas.forEach(function (mapa) {
        mapa.classList.remove('ativo');
    });

    faseAtual = (faseAtual + 1) % mapas.length;

    mapas[faseAtual].classList.add('ativo');

    painelLogin.classList.remove(...temas);

    painelLogin.classList.add(temas[faseAtual]);

}

// Vetorzão que começae no Mine
mapas[0].classList.add('ativo');
painelLogin.classList.add(temas[0]);

// Troca o mapa e o tema juntos a cada 5 segundos
setInterval(trocarFase, 5000);