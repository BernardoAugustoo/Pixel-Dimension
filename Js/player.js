import { Sprite } from "./sprite.js";

export const player = new Sprite({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
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
            loop: false
        },
        death: {
            src: 'Imgs/Ghost imgs/Ghost-death.png',
            totalFrames: 7,
            framesPerSprite: 10,
            loop: false
        },
    },
    
    offset: {x: 0, y: 18}
})

player.estaNoChao = true;
player.damage = 20;

window.player = player;