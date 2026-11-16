import { canvas } from "./canvas.js";
import { Sprite } from "./sprite.js";
import { groundY } from "./sprite.js";



export class Enemy extends Sprite {
    constructor({position, velocity, sprites, offset = {x: 0, y: 0}, enemyHeight = 186}) {
        super({position, velocity, sprites, offset: {x: 0, y: 0}});

        this.enemyHeight = enemyHeight;

        this.state = "MOVING";

        this.direction = 1;

        this.leftLimit = this.width / 2;
        this.rightLimit = canvas.width - this.width / 2;
        this.position.y = groundY;

        this.enemyCanAttack = true;
        this.enemyAttackCooldown = 800;
        this.rangeDistance = 400;
        this.damage = 30;
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

                if (this.enemyCanAttack) {
                    this.attack();

                    this.enemyCanAttack = false;
                    
                    setTimeout(() => {
                        this.enemyCanAttack = true
                    }, this.enemyAttackCooldown)
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
            case "DEAD":
                this.damage = 0;
                this.health = 0;
                this.velocity.x = 0;
                break;
            case "WIN":
                this.velocity.x = 0;
                break;
        }

        if(this.health <= 0) {
                this.offset = {x: 0, y: 18};
                
                this.setSprite('death');
        
                this.position.y = groundY;
                this.velocity.y = 0;
                this.velocity.x = 0;
                this.direction = 1;
        }
        else if (this.state === 'ATTACKING') {
            this.offset = {x: 0, y: 18};

            this.setSprite('attack');
        }
        else if (this.state === 'CHASING' || this.state === 'MOVING') {
            this.offset = {x: 0, y: 30};
            
            this.setSprite('walk');
        }
        else {
            this.setSprite('idle');
        }
    }
}