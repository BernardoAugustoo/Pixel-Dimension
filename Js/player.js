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

player.estaNoChao = true;
player.damage = 20;
player.health = 100;

window.player = player;