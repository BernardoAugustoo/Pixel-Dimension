import { Sprite } from './sprite.js';
import { player } from './player.js'
import { enemy } from './enemy.js'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

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
    enemy.update();
    player.update();

    player.velocity.x = 0;

    if(keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -4;
    }
    else if(keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 4;
    }

    if( player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        console.log('OUCH!');
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 'w':
            if (player.position.y + player.height === canvas.height) {
                player.estaNoChao = true;
            }
            if(player.estaNoChao) {
                player.velocity.y = -20;
                player.estaNoChao = false;
            }
            break;
        case ' ':
            player.attack()
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }
})