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

function trocarMapa(id, aoCarregar = null) {
    const mapaSelecionado = mapasDisponiveis.find(
        mapa => mapa.id === id
    );

    if (!mapaSelecionado) {
        console.error('Mapa não encontrado!');
        return;
    }

    background.onload = () => {
        console.log('Imagem carregada:', mapaSelecionado.nome);

        if (aoCarregar) {
            aoCarregar();
        }
    };

    background.src = mapaSelecionado.background;

    configurarCenario(mapaSelecionado);

    mapaAtual = mapaSelecionado;

    console.log('Mapa selecionado:', mapaAtual.nome);
}

function avancarMapa() {
    if (transicaoEmAndamento || enemy.health > 0) {
        return;
    }

    if (mapaAtual.id >= mapasDisponiveis.length) {
        console.log("Todas as fases foram concluídas!");
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

            enemy.health = 100;
            enemy.damage = 25;
            enemy.state = "MOVING";
            enemy.position.x = canvas.width - enemy.width;
            enemy.position.y = groundY;
            enemy.velocity.x = 3;
            enemy.velocity.y = 0;
            enemy.direction = -1;
            enemy.isAttacking = false;
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

const gravity = 0.5;

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
let enemies = [];

const spawnEnemies = (positionX) => {
    const enemy = new Enemy({
        position: {
            x: positionX,
            y: 0
        },
        velocity: {
            x: 3,
            y: 0
        },
        sprites: {
            idle: {
                src: 'Imgs/Ghost imgs/Ghost-idle.png',
                totalFrames: 7,
                framesPerSprite: 10,
                loop: true
            },
            walk: {
                src: 'Imgs/Ghost imgs/Ghost-walk.png',
                totalFrames: 8,
                framesPerSprite: 10,
                loop: true
            },
            jump: {
                src: 'Imgs/Ghost imgs/Ghost-jump.png',
                totalFrames: 7,
                framesPerSprite: 10,
                loop: true
            }, 
            attack: {
                src: 'Imgs/Ghost imgs/Ghost-attack.png',
                totalFrames: 6,
                framesPerSprite: 10,
                loop: true
            },
            death: {
                src: 'Imgs/Ghost imgs/Ghost-death.png',
                totalFrames: 7,
                framesPerSprite: 10,
                loop: false
            }
        }
    });
    
    
    enemies.push(enemy);
}

spawnEnemies(500);
spawnEnemies(800);
spawnEnemies(1000);

function animate() {
    window.requestAnimationFrame(animate);

    if (background.complete && background.naturalWidth > 0) {
        ctx.drawImage(
            background,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    ctx.fillStyle = 'blue'
    player.update();

    ctx.fillStyle = 'red'
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

    enemies.forEach(enemy => {
        if (player.isAttacking && checkCollision({ attacker: player, target: enemy })) {
            player.isAttacking = false;
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
            avancarMapa();
        }

    })

    atualizarTransicao();
}

animate()

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
            if (player.position.y === canvas.height) {
                player.estaNoChao = true;
            }
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

let playerNameEl = document.querySelector('#player-name')
let inserdName = localStorage.getItem('nomeJogador');

playerNameEl.innerHTML = inserdName;