import { canvas, ctx } from "./canvas.js";
import { player } from './player.js'
import { enemy } from './enemy.js';
import { checkCollision } from './collision.js'
import { groundY } from "./sprite.js";

const background = new Image();

//Aqui troca os fundos
background.src = "Imgs/Background-Phases/Phase4-HK.jpg"

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

function animate() {
    window.requestAnimationFrame(animate);

    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = 'blue'
    player.update();

    ctx.fillStyle = 'red'
    enemy.updateEnemy(player);

    healthPointsEL.style.width = player.health + '%';

    player.velocity.x = 0;

    if(keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -4;
        player.direction = -1;
    }
    else if(keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 4;
        player.direction = 1;
    }
    else {
        player.velocity.x = 0;
    }

    if(player.health <= 0) {
        player.offset = {x: 0, y: 18};
        
        player.setSprite('death');

        player.position.y = groundY;
        player.velocity.y = 0;
        player.velocity.x = 0;
        player.direction = 1;
    }
    else if(player.isAttacking) {
        player.setSprite('attack');
    }
    else if(!player.estaNoChao) {
        player.offset = {x: 0, y: 18};
        
        player.setSprite('jump');
    }
    else if(player.velocity.x !== 0){
        player.offset = {x: 0, y: 30};

        player.setSprite('walk');
    }
    else {
        player.offset = {x: 0, y: 18};

        player.setSprite('idle')
    }

    if (player.isAttacking && checkCollision({ attacker: player, target: enemy })) {
        player.isAttacking = false;
        player.updateHP(enemy);
    }
    if (enemy.isAttacking && checkCollision({ attacker: enemy, target: player })) {
        enemy.isAttacking = false;
        enemy.updateHP(player);
    }
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