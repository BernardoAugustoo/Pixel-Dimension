import { canvas } from "./canvas.js";
import { Sprite } from "./sprite.js";

let enemyCanAttack = true;
const enemyAttackCooldown = 300;

export class Enemy extends Sprite {
    constructor({position, velocity}) {
        super({position, velocity});

        this.state = "MOVING";

        this.direction = 1;

        this.leftLimit = this.width / 2;
        this.rightLimit = canvas.width - this.width / 2;

        this.rangeDistance = 400;
        this.attackRange = 95;
    }
    
    updateEnemy(player) {
        this.distanceToPlayer = Math.abs(this.position.x - player.position.x) 
        this.update();
    
        switch (this.state) {
            case "MOVING":
                if(this.position.x >= this.rightLimit) {
                    this.direction = -1;
                    this.velocity.x = -3;
                }
                if(this.position.x <= this.leftLimit) {
                    this.direction = 1;            
                    this.velocity.x = 3;
                }
                if(Math.abs(this.distanceToPlayer) <= this.rangeDistance) {
                    this.state = "CHASING"
                }

                break;
            case "CHASING":
                if(this.distanceToPlayer > this.rangeDistance) {
                    this.state = "MOVING";
                }
                if(player.position.x < this.position.x) {
                    this.direction = -1;
                    this.velocity.x = -3;
                }
                if(player.position.x > this.position.x) {
                    this.direction = 1;
                    this.velocity.x = 3;
                }
                if (this.distanceToPlayer > 0 && this.distanceToPlayer <= this.attackRange) {
                    this.state = "ATTACKING"
                }
                break;
            case "ATTACKING":
                this.velocity.x = 0;

                if (enemyCanAttack) {
                    this.attack();

                    enemyCanAttack = false;

                    setTimeout(() => {
                        enemyCanAttack = true
                    }, enemyAttackCooldown)
                }
                
                if (player.position.x > this.position.x) {
                    this.direction = 1;
                }
                if (player.position.x < this.position.x) {
                    this.direction = -1;
                }

                if (this.distanceToPlayer > this.attackRange) {
                    this.state = "CHASING"
                }
                
                break;
        }
    }
}

export const enemy = new Enemy({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 3,
        y: 0
    },
})

enemy.damage = 25;
window.enemy = enemy;

