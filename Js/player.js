import { Sprite } from "./sprite.js";

export const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    sprites: {
        idle: {
            src: 'Imgs/Knight-imgs/idle/',
            totalFrames: 9,
            framesPerSprite: 10,
            loop: true
        },
        walk: {
            src: 'Imgs/Knight-imgs/walk/',
            totalFrames: 8,
            framesPerSprite: 10,
            loop: true
        },
        jump: {
            src: 'Imgs/Knight-imgs/jump/',
            totalFrames: 6,
            framesPerSprite: 10,
            loop: true
        }, 
        attack: {
            src: 'Imgs/Knight-imgs/attack/',
            totalFrames: 8,
            framesPerSprite: 6,
            loop: false 
        },
        death: {
            src: 'Imgs/Knight-imgs/death/',
            totalFrames: 14,
            framesPerSprite: 10,
            loop: false
        },
    },
    
    offset: {x: 0, y: 18}
})

export function trocarPersonagem(nome, frames) {
    const animacoes = ['idle', 'walk', 'jump', 'attack', 'death'];
    const sprites = {};

    animacoes.forEach(animacao => {
        sprites[animacao] = {
            src: `Imgs/${nome}-imgs/${animacao}/`,
            totalFrames: frames[animacao],
            framesPerSprite: animacao === 'attack' ? 6 : 10,
            loop: animacao !== 'attack' && animacao !== 'death'
        };
    });

    const tamanhos = {
        Plant: { width: 150, height: 150 },
        Luffy: { width: 180, height: 180 },
        Captain: { width: 160, height: 160 },
        Knight: { width: 150, height: 150 }
    };

    const direcaoOriginal = {
        Plant: -1,
        Luffy: -1,
        Captain: -1,
        Knight: 1
    };
    player.direcaoOriginal = direcaoOriginal[nome];

    player.sprites = sprites;
    
    player.width = tamanhos[nome].width;
    player.height = tamanhos[nome].height;

    player.currentSprite = null;
    player.setSprite('idle');
    player.health = 100;
    player.isDead = false;
    player.isAttacking = false;
}

player.estaNoChao = true;
player.damage = 20;
player.health = 100;

window.player = player;