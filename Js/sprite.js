const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5;

export class Sprite {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        };
        this.isAttacking;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        if(this.isAttacking) { 
            ctx.fillStyle = 'yellow';
            ctx.fillRect(
                this.attackBox.position.x, 
                this.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x  

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
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
}