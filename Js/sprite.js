const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5;

export class Sprite {
    constructor({position, velocity, sprites}) {
        this.position = position;
        this.velocity = velocity;

        this.sprites = sprites;
        this.currentSprite = this.sprites.idle;
        this.image = new Image();
        this.image.src = this.currentSprite.src;

        this.width = 50;
        this.height = 150;

        this.currentFrame = 0;
        this.elapseTime = 0;
        this.totalFrames = this.currentSprite.totalFrames;
        this.framesPerSprite = this.currentSprite.framesPerSprite;

        this.attackBox = {
            position: {
                x: this.width/2,
                y: -this.height + 50
            },
            width: 50,
            height: 30
        };
        this.isAttacking;
        this.direction = 1;
        this.health = 100;
        this.score = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        if(this.direction === -1) {
            ctx.scale(-1, 1);
        }

        ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);

        this.attackBox.position.x = this.width / 2;
        this.attackBox.position.y = -this.height + 50;

        if(this.isAttacking) { 
            ctx.fillStyle = 'yellow';
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }

        ctx.restore();
    }

    update() {
        this.draw()
        
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.position.x - this.width/2 <= 0) {
            this.position.x = this.width/2
        }
        if(this.position.x + this.width/2 >= canvas.width) {
            this.position.x = canvas.width - this.width / 2;
        }

        if(this.position.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = canvas.height;
        }
        else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    updateHP(target) {
        const damage = this.damage;

        if(target.health <= 0) {
            target.health = 0;
        }

        target.health -= damage;
    }
}