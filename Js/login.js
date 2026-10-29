const form = document.querySelector('#form-login');
const inputName = document.querySelector('#nome');
const inputPassword = document.querySelector('#senha');
const referencesButton = document.querySelector('#botao-referencias');
const loginPanel = document.querySelector('#painel-login');
const maps = document.querySelectorAll('.mapa');

const themes = [
    'tema-minecraft',
    'tema-fortnite',
    'tema-tlou',
    'tema-hollow-knight'
];

let currentPhase = 0;

form.addEventListener('submit', function (event) {

    event.preventDefault();

    const name = inputName.value.trim();

    if (name === '') {
        alert('Digite seu nome!');

        inputName.focus();
        return;
    }

    localStorage.setItem('nomeJogador', name);

    inputPassword.value = '';

    window.location.href = 'game.html';

});

referencesButton.addEventListener('click', function () {

    window.location.href = 'referencias.html';

});

function trocarFase() {

    maps.forEach(function (map) {
        map.classList.remove('ativo');
    });

    currentPhase = (currentPhase + 1) % maps.length;

    maps[currentPhase].classList.add('ativo');

    loginPanel.classList.remove(...themes);

    loginPanel.classList.add(themes[currentPhase]);

}

// Vetorzão que começae no Mine
maps[0].classList.add('ativo');
loginPanel.classList.add(themes[0]);

// Troca o mapa e o tema juntos a cada 5 segundos
setInterval(trocarFase, 5000);