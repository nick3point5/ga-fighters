const ex = class interObj {
    constructor(x, y, width, height, element) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xmin = 0;
        this.xmax = playwin.width - width;
        this.ymin = 0;
        this.ymax = playwin.height - height;
        this.rotation = 0;
        this.speed = 0;
        this.direction = 1
        this.move = {
            up: false,
            ri: false,
            dn: false,
            lf: false,
        };
        this.element = element;
    }
    collision(hurtbox) {
        if (
            this.x + this.width > hurtbox.x &&
            this.x < hurtbox.x + hurtbox.width &&
            this.y + this.height > hurtbox.y &&
            this.y < hurtbox.y + hurtbox.width
        ) {
            return true
        }
        return false
    };
    moveFunction() {
        if (this.move.up && this.y - this.speed >= this.ymin) {
            this.y -= this.speed;
        }
        if (this.move.dn && this.y + this.speed <= this.ymax) {
            this.y += this.speed;
        }
        if (this.move.lf && this.x - this.speed >= this.xmin) {
            this.x -= this.speed;
        }
        if (this.move.ri && this.x + this.speed <= this.xmax) {
            this.x += this.speed;
        }
        this.element.style.transform = `translate(${this.x}px,${this.y}px) rotateZ(${this.rotation}deg) scaleX(${this.direction})`
    }
    position() {
        this.element.style.transform = `translate(${this.x}px,${this.y}px) rotateZ(${this.rotation}deg)`
    }
    trackdown(target) {
        if (this.x < target.x) {
            this.move.ri = true;
            this.move.lf = false;
        } else {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.y > target.y) {
            this.move.up = true;
            this.move.dn = false;
        } else {
            this.move.up = false;
            this.move.dn = true;
        }
    }
    stop() {
        this.speed = 0
        this.move.up = false
        this.move.ri = false
        this.move.dn = false
        this.move.lf = false
    }
}

function con() {
    console.log('asdddd');
}