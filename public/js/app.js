class interObj {
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

class fireball extends interObj {
    constructor(x, y, element) {
        super(x, y, element.clientWidth, element.clientHeight, element)
        this.speed = 3;
    }
}

class fighter extends interObj {
    constructor(x, y, element, name) {
        super(x, y,150, 200, element)
        this.hp=100
        this.mp=5
        this.atk=5
        this.def=5
        this.spAtk=5
        this.spDef=5
        this.control = true

    }
    attack(target){
        
        if (this.collision(target)) {
            if(this.atk > target.def){
                target.hp -= this.atk - target.def
            } else {
                target.hp -= 2
            }
        }
    }
    fireball(target){
        console.log('fireball')
    }



}

class attackClass extends interObj{
    constructor(x, y, width, height, element) {
        super(x, y, width, height, element)
        this.speed = 5;
    }
}
class playerClass extends fighter {
    constructor(x, y, element, name) {
        super(x, y, element)
        this.speed = 5;
    }




}
class enemyClass extends fighter {
    constructor(x, y, element, name) {
        super(x, y, element)
        this.speed = 5;
    }




}
class petClass extends interObj {
    constructor(x, y, width, height, element, name) {
        super(x, y, width, height, element);
        this.name = name
        this.speed = 5;
        this.growth = 1;
        this.conditions = ['happy', 'hungry', 'sleepy', 'bored', 'sleeping', 'eating', 'singing']
        this.currentState = 'happy'
        this.spriteFrame = 0
        this.spriteFrameRate = 1
        this.spriteAnimationLength = {
            walking: 9,
            sleeping: 4,
            eating: 12,
            singing: 30,
        }
        this.spriteFrameMax = 9

        this.move = {
            up: false,
            ri: true,
            dn: false,
            lf: false,
        };

        this.alive = false;
    }
    spriteFile() {
        let imgURL = ['assets/sprites/walking/', 'assets/sprites/sleeping/', 'assets/sprites/eating/', 'assets/sprites/sing/']
        if (this.currentState === pet.conditions[4]) {
            return `${imgURL[1]}${this.spriteFrame}.png`
        } else if (this.currentState === pet.conditions[5]) {
            return `${imgURL[2]}${this.spriteFrame}.png`
        } else if (this.currentState === pet.conditions[6] && pet.collision(stage)) {
            return `${imgURL[3]}${this.spriteFrame}.png`
        } else {
            return `${imgURL[0]}${this.spriteFrame}.png`
        }
    }
    drawSprite() {
        if (this.spriteFrame > this.spriteFrameMax) {
            this.spriteFrame = 0
        }
        this.element.setAttribute('src', this.spriteFile())

        this.spriteFrame++
    }

    petAi() {
        if (this.currentState === this.conditions[0]) {
            this.stateHappy()
        }
        if (this.currentState === this.conditions[1]) {
            this.stateHungry()
        }
        if (this.currentState === this.conditions[2]) {
            this.stateSleepy()
        }
        if (this.currentState === this.conditions[3]) {
            this.stateBored()
        }
        if (this.currentState === this.conditions[4]) {
            this.stateSleeping()
        }
        if (this.currentState === this.conditions[5]) {
            this.stateEating()
        }
        if (this.currentState === this.conditions[6]) {
            this.stateSinging()
        }

    }

    stateHappy() {
        this.speed = 5
        if (this.x >= this.xmax - 4) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xmin + 4) {
            this.move.ri = true;
            this.move.lf = false;
        }
        this.spriteFrameMax = this.spriteAnimationLength.walking
        this.spriteFrameRate = 2
    }

    stateHungry() {
        this.speed = 10
        this.trackdown(food)
        if (this.collision(food)) {
            this.spriteFrame = 0
            this.stateEating()
            this.currentState = this.conditions[5]
        }
        this.spriteFrameMax = this.spriteAnimationLength.walking
        this.spriteFrameRate = 1
    }

    stateSleepy() {
        this.speed = 1
        if (this.x >= this.xmax) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xmin) {
            this.move.ri = true;
            this.move.lf = false;
        }
        this.spriteFrameMax = this.spriteAnimationLength.walking
        this.spriteFrameRate = 3
    }

    stateBored() {
        this.speed = 3
        if (this.x >= this.xmax - 4) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xmin + 4) {
            this.move.ri = true;
            this.move.lf = false;
        }
        this.spriteFrameMax = this.spriteAnimationLength.walking
        this.spriteFrameRate = 2
    }

    stateSleeping() {
        this.stop()
        this.spriteFrameMax = this.spriteAnimationLength.sleeping
        this.spriteFrameRate = 3
    }

    stateEating() {
        this.stop()
        this.spriteFrameMax = this.spriteAnimationLength.eating
        this.spriteFrameRate = 1
    }

    stateSinging() {
        this.speed = 10
        this.spriteFrameRate = 1
        if (!this.collision(stage)) {
            this.trackdown(stage)
        } else {
            this.stop()
            this.spriteFrameMax = this.spriteAnimationLength.singing
            this.spriteFrameRate = 2
        }

    }

    petUpdate() {
        this.belly -= this.appetite;
        this.energy -= this.stamina;
        this.fun -= this.attention;
        this.age += 1 / playwin.framerate;
        this.name = document.getElementById('name').value
        this.aging()
        if (this.belly <= 0 || this.energy <= 0 || this.fun <= 0) {
            this.alive = false;
        }
        this.conditionCheck()
        if (!(playwin.frame % this.spriteFrameRate)) {
            this.drawSprite()
        }
        this.moveFunction();
        this.petAi();
    }

    conditionCheck() {
        if (this.currentState === this.conditions[4]) {
            if (this.energy < 10) {
                this.belly += this.appetite;
                this.energy += 0.2 + this.stamina;
                this.fun += this.attention;
                if (this.energy > 10) {
                    this.energy = 10
                    this.move.ri = true
                    this.currentState = ''
                    this.conditionCheck()
                }
                return
            }
        }


        if (this.currentState === this.conditions[5]) {
            if (this.spriteFrame < 5) {
                food.trackdown(pet)
                food.moveFunction()
                food.element.style.transform = `scale(1)`
            }

            if (this.spriteFrame === 5) {
                $('#food').addClass('hidden')
                food.x = -food.width
                food.y = food.ymax + food.height
                food.position()
            }


            if (this.spriteFrame === this.spriteAnimationLength.eating) {
                this.move.ri = true
                this.currentState = ''
                this.belly = 10
                this.spriteFrame = 0
                this.conditionCheck()
            } else {
                this.belly += this.appetite;
                this.energy += this.stamina;
                this.fun += this.attention;

                return
            }
        }

        if (this.currentState === this.conditions[6]) {
            if (this.spriteFrame === this.spriteAnimationLength.singing) {
                this.move.ri = true
                this.currentState = ''
                this.fun = 10
                this.spriteFrame = 0
                this.conditionCheck()
            } else {
                this.belly += this.appetite;
                this.energy += this.stamina;
                this.fun += this.attention;

                return
            }
        }



        if (this.belly >= 5 && this.energy >= 5 && this.fun >= 5) {
            this.currentState = this.conditions[0]
        } else
            if (this.belly < 5 && this.belly <= this.energy && this.belly <= this.fun) {
                this.currentState = this.conditions[1]
            } else
                if (this.energy < 5 && this.energy <= this.fun && this.energy <= this.belly) {
                    this.currentState = this.conditions[2]
                } else
                    if (this.fun < 5 && this.fun <= this.energy && this.fun <= this.belly) {
                        this.currentState = this.conditions[3]
                    }

    }
}


//ANCHOR update each frame
function update() {
    if (!playwin.pause) {
        uiUpdate();
        playerCharacter.moveFunction()
        enemyCharacter.moveFunction()
        playwin.frame++
    }
}

function uiUpdate() {
    gaugeUi()
    timerUi()
}

function gaugeUi() {
    enemyHpBar.value = enemyCharacter.hp
    playerHpBar.value = playerCharacter.hp
}

function timerUi() {
    playwin.timer -= 1/playwin.framerate
    timerEle.textContent = Math.ceil(playwin.timer)
}



//ANCHOR function utility

function getRand(max, min) {
    let num = Math.random() * (max + 1 - min) + min - 1;
    num = Math.ceil(num);
    return num;
}

//ANCHOR metagame functions

function game() {
    Init();
    const active = setInterval(() => {
        update();
        if (playwin.gameOver) {
            uiUpdate();
            clearInterval(active);
            gameOver();
        }
    }, 1000 / playwin.framerate);

}

function gameOver() {
    // $("#music")[0].pause();
    // $("#music")[0].currentTime = 0;
    playwin.pause = true

}

function Init() {

    // $("#music")[0].play();


    playwin.pause = false
}

function pause() {
    if (pet.alive) {
        playwin.pause = !playwin.pause
        if (playwin.pause) {
            // $("#music")[0].pause()
        } else {
            // $("#music")[0].play()
        }
        if (playwin.pause) {
            // $('img.icon.pause').attr('src','assets/icons/play_arrow-24px.svg')
        } else {
            // $('img.icon.pause').attr('src','assets/icons/pause-24px.svg')
        }
    }
}

function mute() {
    playwin.mute = !playwin.mute
    // $('audio')[0].muted = playwin.mute
    if (playwin.mute) {
        //   $('img.icon.mute').attr('src','assets/icons/volume_off-24px.svg')
    } else {
        //   $('img.icon.mute').attr('src','assets/icons/volume_up-24px.svg')
    }
}

function assignEvents() {
    // $('#pauseBtn').on("click", pause)
    // $('#muteBtn').on("click", mute)
    // $('.notification').on('click', function () {
    //     if (!pet.alive) {
    //         game()
    //     }
    // })
    window.addEventListener("keydown", getKey);
    window.addEventListener("keyup", releaseKey);
}

//ANCHOR global var and obj

playwin = {
    height: 500,
    width: 800,
    element: document.getElementById('play-window'),
    mute: false,
    pause: true,
    frame: 0,
    framerate: 30,
    timer: 99,
    gameOver: false
};

function getKey(event) {
    controller(event.key)   
}

function controller(inp){
    if(playerCharacter.control){
        if(inp === 'ArrowUp'){
            playerCharacter.move.up = true
        }
        if(inp === 'ArrowDown'){
            playerCharacter.move.dn = true
        }
        if(inp === 'ArrowLeft'){
            playerCharacter.move.lf = true
        }
        if(inp === 'ArrowRight'){
            playerCharacter.move.ri = true
        }
        if(inp === ' '){
            playerCharacter.attack(enemyCharacter)
        }
    }
    // console.log(inp)
    // console.log(playerCharacter.move);
}

function releaseKey(inp) {
    if(inp.key === 'ArrowUp'){
        playerCharacter.move.up = false
    }
    if(inp.key === 'ArrowDown'){
        playerCharacter.move.dn = false
    }
    if(inp.key === 'ArrowLeft'){
        playerCharacter.move.lf = false
    }
    if(inp.key === 'ArrowRight'){
        playerCharacter.move.ri = false
    }
    // console.log(inp)
}

let playerCharacter = new playerClass(
    0,0,document.getElementById('player'),'guy'
)

let enemyCharacter = new enemyClass(
    400,200,document.getElementById('enemy'),'sdf'
)

let playerAttack = new attackClass(
    100,0,50,50,document.getElementById('enemy'),playerCharacter
)

enemyHpBar = document.getElementById('enemy-hp')
playerHpBar = document.getElementById('player-hp')
timerEle = document.getElementById('timer')



game()
assignEvents()
mute()
