import { canvas, ctx } from "./canvas.js";
import { player } from './player.js'
import { Enemy } from './enemy.js';
import { checkCollision } from './collision.js'
import { groundY, configurarCenario } from "./sprite.js";
import { carregarMapas } from './mapa.js';

//Aqui troca os fundos
const background = new Image();

let mapasDisponiveis = [];
let mapaAtual = null;
let transicaoEmAndamento = false;
let opacidadeTransicao = 0;
let faseTransicao = "nenhuma";
const velocidadeTransicao = 0.015;
let tempoPausa = 0;
const duracaoPausa = 120;
let enemiesSpawned = false;
const enemiesQtd = 10;
let scoreValue;

scoreValue = document.querySelector('#score-value');

function trocarMapa(id, aoCarregar = null) {
    const mapaSelecionado = mapasDisponiveis.find(
        mapa => mapa.id === id
    );

    if (!mapaSelecionado) {
        console.error('Mapa não encontrado!');
        return;
    }

    background.onload = () => {

        if (aoCarregar) {
            aoCarregar();
        }
    };

    background.src = mapaSelecionado.background;

    configurarCenario(mapaSelecionado);

    mapaAtual = mapaSelecionado;
}

function avancarMapa() {
    if (transicaoEmAndamento) {
        return;
    }

    if (mapaAtual.id >= mapasDisponiveis.length) {
        return;
    }

    transicaoEmAndamento = true;
    faseTransicao = "saida";
}


function atualizarTransicao() {

    if (faseTransicao === "saida") {

        opacidadeTransicao += velocidadeTransicao;

        if (opacidadeTransicao >= 1) {
            opacidadeTransicao = 1;

            faseTransicao = "carregando";

            trocarMapa(mapaAtual.id + 1, () => {
                tempoPausa = 0;
                faseTransicao = "pausa";
            });

            player.health = 100;
            player.position.x = 200;
            player.position.y = groundY;
            player.velocity.x = 0;
            player.velocity.y = 0;
            player.estaNoChao = true;
            player.isAttacking = false;
            player.direction = 1;

            enemies.length = 0;
            //Chamando a funcao para cada mapa que troca
            spawnEnemies();
        }

    }

    else if (faseTransicao === "pausa") {

        tempoPausa++;

        if (tempoPausa >= duracaoPausa) {
            faseTransicao = "entrada";
        }
    }

    else if (faseTransicao === "entrada") {

        opacidadeTransicao -= velocidadeTransicao;

        if (opacidadeTransicao <= 0) {
            opacidadeTransicao = 0;
            faseTransicao = "nenhuma";
            transicaoEmAndamento = false;
        }
    }

    ctx.fillStyle = `rgba(0, 0, 0, ${opacidadeTransicao})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

carregarMapas().then(mapas => {

    if (!mapas) return;

    mapasDisponiveis = mapas;

    trocarMapa(1);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height);

let healthPointsEL = document.querySelector("#health-points");

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
}

let lastKey;

//Vetor de inimigos criado aq
let enemies = [];

//Funcao que adiciona um novo enemy no vetor enemies
const createEnemies = (positionX) => {
    const enemy = new Enemy({
        position: {
            x: positionX,
            y: 0
        },
        enemyHeight: 130,
        velocity: {
            x: 3,
            y: 0
        },
        sprites: {
        idle: {
            src: 'Imgs/Husk-imgs/idle/',
            totalFrames: 6,
            framesPerSprite: 10,
            loop: true
        },
        walk: {
            src: 'Imgs/Husk-imgs/walk/',
            totalFrames: 7,
            framesPerSprite: 10,
            loop: true
        },
        attack: {
            src: 'Imgs/Husk-imgs/attack/',
            totalFrames: 8,
            framesPerSprite: 10,
            loop: false
        },
        },
    });

    enemy.id = positionX;
    enemies.push(enemy);
}

//Funcao para spawnar uma "enemiesQtd" inimigos a cada 1seg
const spawnEnemies = () => {
    for (let i = 0; i < enemiesQtd; i++) {
        setTimeout(() => {
            createEnemies(Math.floor(Math.random() * (canvas.width - canvas.width/2 + 1)) + canvas.width/2);

            if(i === enemiesQtd - 1) {
                enemiesSpawned = true;

            }

        }, (i + 1) * 1000);
    }
}

//Chamando a funcao para o primeiro mapa
spawnEnemies();

window.enemies = enemies;

setInterval(() => {
    if(player.health > 0) {
        scoreValue.innerText = Number(scoreValue.innerText) + 1;
    }

}, 50)

function animate() {
    window.requestAnimationFrame(animate);

    console.log(scoreValue.innerText)

    if (background.complete && background.naturalWidth > 0) {
        ctx.drawImage(
            background,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    enemies.forEach(enemy => {
        enemy.updateEnemy(player);
    })

    healthPointsEL.style.width = player.health + '%';

    player.velocity.x = 0;

    if (keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -4;
        player.direction = -1;
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 4;
        player.direction = 1;
    }
    else {
        player.velocity.x = 0;
    }

    
    if (player.health <= 0) {
        player.offset = { x: 0, y: 18 };
        
        player.setSprite('death');
        
        player.position.y = groundY;
        player.health = 0;
        player.velocity.y = 0;
        player.velocity.x = 0;
        player.direction = 1;
    }
    else if (player.isAttacking) {
        player.setSprite('attack');
    }
    else if (!player.estaNoChao) {
        player.offset = { x: 0, y: 18 };
        
        player.setSprite('jump');
    }
    else if (player.velocity.x !== 0) {
        player.offset = { x: 0, y: 30 };
        
        player.setSprite('walk');
    }
    else {
        player.offset = { x: 0, y: 18 };
        
        player.setSprite('idle')
    }
    
    enemies.forEach((enemy) => {
        if (player.isAttacking && checkCollision({ attacker: player, target: enemy })) {
            
            player.updateHP(enemy);
        }
        if (enemy.isAttacking && checkCollision({ attacker: enemy, target: player })) {
            enemy.isAttacking = false;
            enemy.updateHP(player);
        }
        if (player.health <= 0) {
            enemy.state = "WIN";
        }
        if (enemy.health <= 0) {
            enemy.state = "DEAD";
        }
        
    })
    
    player.update();

    const remainingEnemies = enemies.filter(e => e.health > 0);

    window.remainingEnemies = remainingEnemies;

    if (remainingEnemies.length === 0 && enemiesSpawned) {
        avancarMapa()
    }

    atualizarTransicao();
}

let canAttack = true;
const attackCooldown = 300;

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'D':
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break;
        case 'A':
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 'W':
        case 'w':
            if (player.estaNoChao) {
                player.velocity.y = -20;
                player.estaNoChao = false;
            }
            break;
        case ' ':
            if (canAttack) {
                player.attack();

                canAttack = false;

                setTimeout(() => {
                    canAttack = true;
                }, attackCooldown)
            }
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'D':
        case 'd':
            keys.d.pressed = false;
            break;
        case 'A':
        case 'a':
            keys.a.pressed = false;
            break;
    }
})

animate();

let playerNameEl = document.querySelector('#player-name')
let inserdName = localStorage.getItem('nomeJogador');

playerNameEl.innerHTML = inserdName;