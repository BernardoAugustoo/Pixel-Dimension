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
            src: '',
            totalFrames: 7,
            framesPerSprite: 10
        },
        walk: {
            src: '',
            totalFrames: 8,
            framesPerSprite: 10
        },
        jump: {
            src: '',
            totalFrames: 7,
            framesPerSprite: 10
        }, 
        attack: {
            src: '',
            totalFrames: 6,
            framesPerSprite: 10
        },
        damage: {
            src: '',
            totalFrames: 6,
            framesPerSprite: 10
        },
        death: {
            src: '',
            totalFrames: 7,
            framesPerSprite: 10
        },
    },
})

player.estaNoChao = true;
player.damage = 20;

window.player = player;