import { Sprite } from "./sprite.js";

export const enemy = new Sprite({
    position: {
        x: 320,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

window.enemy = enemy;