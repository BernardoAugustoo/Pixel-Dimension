import { canvas, ctx} from "./canvas.js";
import { player } from './player.js'
import { enemy } from './enemy.js';
import { checkCollision } from './collision.js'

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = 'blue'
    player.update();

    ctx.fillStyle = 'red'
    enemy.updateEnemy(player);

    
    player.velocity.x = 0;
    
    if(keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -4;
        player.direction = -1;
    }
    else if(keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 4;
        player.direction = 1;
    }
    
    if(player.isAttacking && checkCollision({attacker: player, target: enemy})) {
        player.isAttacking = false;
        console.log('JOGADOR ATACANDO!');
    }
    if(enemy.isAttacking && checkCollision({attacker: enemy, target: player})) {
        enemy.update();
        enemy.isAttacking = false;
        console.log('JOGADOR SENDO ATACADO!');
    }
}

animate()

let canAttack = true;
const attackCooldown = 300;
    
window.addEventListener('keydown', (event) => {
    switch(event.key) {
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
            if(player.estaNoChao) {
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
    switch(event.key) {
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