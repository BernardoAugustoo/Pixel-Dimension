import { Sprite } from "./sprite.js";

export const checkCollision = ({attacker, target}) => {
    const attackBoxRelativePosition = {
        x: attacker.direction === 1
            ? attacker.position.x + attacker.attackBox.position.x
            : attacker.position.x - attacker.attackBox.position.x - attacker.attackBox.width,
        y: attacker.position.y  + attacker.attackBox.position.y
    };

    const targetLeft = target.position.x - target.width / 2;
    const targetRight = target.position.x + target.width / 2;
    const targetTop = target.position.y - target.height;
    const targetBottom = target.position.y;

    return (
        attackBoxRelativePosition.x + attacker.attackBox.width >= targetLeft &&
        attackBoxRelativePosition.x <=  targetRight &&
        attackBoxRelativePosition.y + attacker.attackBox.height >= targetTop &&
        attackBoxRelativePosition.y <= targetBottom
    );
}