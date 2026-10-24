const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5;

export class Sprite {
    constructor({position, velocity, source, scale, offset, sprites}) {
        this.position = position;
        this.velocity = velocity;

        this.scale = scale || 1;
        this.offset = offset || { x: 0, y: 0 };
        this.image = new Image();
        this.sprites = sprites || {
            idle: {
                src: "",
                totalFrames: 1,
                framesPerSprite: 1,
            }
        };

        this.currentSprite = this.sprites.idle;
        this.image.src = this.currentSprite.src;

        this.width = 50;
        this.height = 150;
        this.elapseTime = 0;
        this.currentFrame = 0;
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
        this.isAttacking = false;
        this.direction = 1;
        this.health = 100;
        this.score = 0;
    }

    setSprite(sprite) {
        const nextSprite = this.sprites[sprite];
        if(!nextSprite || this.currentSprite === nextSprite) {
            return;
        }

        this.currentSprite = nextSprite;
        this.loadSprite();
    }

    loadSprite(sprite) {
        this.image = new Image();
        this.image.src = this.currentSprite.src;
        this.totalFrames = this.currentSprite.totalFrames;
        this.framesPerSprite = this.currentSprite.framesPerSprite;

        this.currentFrame = 0;
        this.elapseTime = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y);
        
        if(this.direction === -1) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.totalFrames),
            0,
            this.image.width / this.totalFrames,
            this.image.height,
            -this.width / 2 - this.offset.x,
            -this.height - this.offset.y,
            this.width * this.scale,
            this.height * this.scale,
        );

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

    animateSprite() {
        this.elapseTime++;

        if(this.elapseTime >= this.framesPerSprite) {
            this.currentFrame++;
            if(this.currentFrame >= this.totalFrames) {
               this.currentFrame = 0; 
            }
            this.elapseTime = 0;
        }
    }

    update() {
        this.draw()
        this.animateSprite();

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
            this.estaNoChao = true;
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