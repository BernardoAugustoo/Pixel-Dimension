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
    estaNoChao: true,
})