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
})

player.estaNoChao = true;
player.damage = 20;

window.player = player;