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
            framesPerSprite: 10
        },
        walk: {
            src: 'Imgs/Ghost imgs/Ghost-walk.png',
            totalFrames: 8,
            framesPerSprite: 10
        },
        jump: {
            src: 'Imgs/Ghost imgs/Ghost-jump.png',
            totalFrames: 7,
            framesPerSprite: 10
        }, 
        attack: {
            src: 'Imgs/Ghost imgs/Ghost-attack.png',
            totalFrames: 6,
            framesPerSprite: 10
        },
        damage: {
            src: 'Imgs/Ghost imgs/Ghost-damage.png',
            totalFrames: 6,
            framesPerSprite: 10
        },
        death: {
            src: 'Imgs/Ghost imgs/Ghost-death.png',
            totalFrames: 7,
            framesPerSprite: 10
        },
    },
})

player.estaNoChao = true;
player.damage = 20;

window.player = player;