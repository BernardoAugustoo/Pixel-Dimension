import { canvas } from "./canvas.js";
import { Sprite } from "./sprite.js";
import { groundY } from "./sprite.js";

let enemyCanAttack = true;
const enemyAttackCooldown = 600;

export class Enemy extends Sprite {
    constructor({position, velocity, sprites, offset = {x: 0, y: 0}}) {
        super({position, velocity, sprites, offset: {x: 0, y: 0}});

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

                if(player.health <= 0) {
                    this.state = "MOVING";
                }
                break;
        }

        if(enemy.health <= 0) {
                enemy.offset = {x: 0, y: 18};
                
                enemy.setSprite('death');
        
                enemy.position.y = groundY;
                enemy.velocity.y = 0;
                enemy.velocity.x = 0;
                enemy.direction = 1;
        }
        else if (enemy.state === 'ATTACKING') {
            enemy.offset = {x: 0, y: 18};

            enemy.setSprite('attack');
        }
        else if (enemy.state === 'CHASING' || enemy.state === 'MOVING') {
            enemy.offset = {x: 0, y: 30};
            
            enemy.setSprite('walk');
        }
        else {
            enemy.setSprite('idle');
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
        }
    }
})

enemy.damage = 25;
window.enemy = enemy;

