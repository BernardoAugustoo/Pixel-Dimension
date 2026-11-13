const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillRect(0, 0, canvas.width, canvas.height)

let gravity = 0.5;
let altura_chao;

export let groundY;

// Atualiza o cenário
export function configurarCenario(configuracao) {

    gravity = configuracao.gravidade;
    altura_chao = configuracao.alturaChao * canvas.height;

    groundY = canvas.height - altura_chao;
}

export class Sprite {
    constructor({position, velocity, sprites, offset = {x: 0, y: 0}}) {
        this.position = position;
        this.velocity = velocity;

        this.sprites = sprites || {};
        this.currentSprite = this.sprites.idle || null;
        this.image = new Image();
        if(this.currentSprite) {
            this.image.src = this.currentSprite.src;
        }
        this.offset = offset;

        this.width = 70;
        this.height = 190;

        this.currentFrame = 0;
        this.elapseTime = 0;
        this.totalFrames = this.currentSprite?.totalFrames;
        this.framesPerSprite = this.currentSprite?.framesPerSprite;

        this.attackBox = {
            position: {
                x: this.width / 2,
                y: -this.height + 50
            },
            width: 50,
            height: 30
        };
        this.isAttacking = false;
        this.direction = 1;
        this.health = 100;
        this.isDead = false;
        this.score = 0;
    }

    setSprite(sprite) {
        const nextSprite = this.sprites[sprite];

        if (!nextSprite || this.currentSprite === nextSprite) return;

        this.currentSprite = nextSprite;
        this.image.src = nextSprite.src;
        this.totalFrames = nextSprite.totalFrames;
        this.framesPerSprite = nextSprite.framesPerSprite;
        this.currentFrame = 0;
        this.elapseTime = 0;
    }

    draw() {
        if(this.isDead) {
            return;
        }
        
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }

        //ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);
        ctx.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.totalFrames),
            0,
            this.image.width / this.totalFrames,
            this.image.height,
            -(this.currentSprite === this.sprites.attack ? this.width : this.width / 2) + this.offset.x,
            -this.height + this.offset.y,
            this.currentSprite === this.sprites.attack ? this.width * 2 : this.width,
            this.height
        );

        this.attackBox.position.x = this.width / 2;
        this.attackBox.position.y = -this.height + 50;
        /*if (this.isAttacking) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }*/

        ctx.restore();
    }

    animateSprite() {
        this.elapseTime++;

        if (this.elapseTime >= this.framesPerSprite) {
            if (this.currentFrame < this.totalFrames - 1) {
                this.currentFrame++;
            }
            else {
                if (this.currentSprite.loop) {
                    this.currentFrame = 0;
                }
            }
            this.elapseTime = 0;
        }
    }

    update() {
        this.draw()
        this.animateSprite();
        
        this.position.y += this.velocity.y;

        this.position.x += this.velocity.x;

        if (this.position.x - this.width / 2 <= 0) {
            this.position.x = this.width / 2;
        }

        if (this.position.x + this.width / 2 >= canvas.width) {
            this.position.x = canvas.width - this.width / 2;
        }

        if (this.position.y >= groundY) {
            this.position.y = groundY;
            this.velocity.y = 0;
            this.estaNoChao = true;
        } else {
            this.velocity.y += gravity;
            this.estaNoChao = false;
        }
    }

    attack() {
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 500)
    }

    updateHP(target) {
        const damage = this.damage;
        console.log(target + "levou " + this.damage);

        if (target.health <= 0) {
            target.health = 0;

            target.isDead = true;

            return;
        }

        target.health -= damage;

        console.log(target + "vida: " + target.health);
    }

    toString() {
        return `sprite ${this.id}`
    }
}