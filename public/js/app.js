class interObj {
    constructor(x, y, width, height, element) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xMin = 0;
        this.xMax = playwin.width - width;
        this.yMin = 0;
        this.yMax = playwin.height - height;
        this.rotation = 0;
        this.xSpd = 0;
        this.ySpd = 0;
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
        if (this.move.up && this.y - this.ySpd >= this.yMin) {
            this.y -= this.ySpd;
        }
        if (this.move.dn && this.y + this.ySpd <= this.yMax) {
            this.y += this.ySpd;
        }
        if (this.move.lf && this.x - this.xSpd >= this.xMin) {
            this.x -= this.xSpd;
        }
        if (this.move.ri && this.x + this.xSpd <= this.xMax) {
            this.x += this.xSpd;
        }
        this.position()
    }
    position() {
        this.element.style.transform = `translate(${this.x}px,${this.y}px) rotateZ(${this.rotation}deg) scaleX(${this.direction})`
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
        this.ySpd = 0
        this.xSpd = 0
        this.move.up = false
        this.move.ri = false
        this.move.dn = false
        this.move.lf = false
    }
}

class fireballClass extends interObj {
    constructor(x, y, element, direction) {
        super(x, y, 20, 20, element)
        this.xSpd = 3;
        if(this.direction>0){
            this.move.ri = true
        }else{
            this.move.lf = true
        }
    }
    launch(target){ 
        this.position()
        this.element.classList.remove('hidden')
        const launch = setInterval(()=>{

        this.moveFunction()
        if(this.collision(target)){
                if(this.spAtk > target.spDef){
                    target.hp -= this.spAtk*3 - target.spDef + 10
                } else {
                    target.hp -= 10
                }
            this.element.remove()
            clearInterval(launch);
        }
        if (this.x - this.speed <= this.xMin) {
            this.element.remove()
            clearInterval(launch);
        }
        if (this.x + this.speed >= this.xMax) {
            this.element.remove()
            clearInterval(launch);
        }

    },1000/playwin.framerate)
    }
}

class fighter extends interObj {
    constructor(x, y, element, name, HitBox) {
        super(x, y,100, 150, element)
        this.hp=100
        this.mp=100
        this.atk=5
        this.def=5
        this.spAtk=5
        this.spDef=5
        this.control = true
        this.HitBox = HitBox
    }
    attack(target){
        
        if (this.HitBox.collision(target)) {
            if(this.atk > target.def){
                target.hp -= this.atk - target.def
            } else {
                target.hp -= 2
            }
        }
    }
    fireball(target){

        if (this.mp >= 10) {
            
            const  fire = document.createElement('div')
            fire.classList.add("fire")
            fire.classList.add("hitbox")
            fire.classList.add("hidden")
            
            playwin.element.appendChild(fire)
            const fireball = new fireballClass(
                this.x+this.width,this.y+80,fire,this.direction
            )
                
            fireball.launch(target)
            this.mp -= 10
        }
                

    }



}





class attackClass extends interObj{
    constructor(x, y, width, height, element) {
        super(x, y, width, height, element)
    }
    moveFunction() {
        if(this.user.direction>0){

            this.x = this.user.x+this.user.width
            this.y = this.user.y
        }else{
            this.x = this.user.x-this.width
            this.y = this.user.y
        }
    }
}
class playerClass extends fighter {
    constructor(x, y, element, name, HitBox, hp, mp, atk, def, spAtk, spDef) {
        super(x, y, element, name, HitBox)
        this.hp=hp
        this.mp=mp
        this.atk=atk
        this.def=def
        this.spAtk=spAtk
        this.spDef=spDef
        this.xSpd = 5;
        this.airborne = true
    }
    update(){
        if(this.airborne && this.y + this.ySpd >= this.yMax){
            this.airborne=false
            this.ySpd = 0
            console.log('ground');
        }
    }




}
class enemyClass extends fighter {
    constructor(x, y, element, name) {
        super(x, y, element)
        this.xSpd  = 5;
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
        if (this.x >= this.xMax - 4) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xMin + 4) {
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
        if (this.x >= this.xMax) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xMin) {
            this.move.ri = true;
            this.move.lf = false;
        }
        this.spriteFrameMax = this.spriteAnimationLength.walking
        this.spriteFrameRate = 3
    }

    stateBored() {
        this.speed = 3
        if (this.x >= this.xMax - 4) {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.x <= this.xMin + 4) {
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
                food.y = food.yMax + food.height
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
        movement();
        playerCharacter.update();
        gravity()
        playwin.frame++
    }
}

function gravity() {
    if(playerCharacter.airborne){
        playerCharacter.ySpd = 4
        playerCharacter.move.dn = true
    }else{

    }
}

function movement() {
    playerCharacter.moveFunction()
    playerAttack.moveFunction()
    enemyCharacter.moveFunction()
}

function uiUpdate() {
    gaugeUi()
    timerUi()
}

function gaugeUi() {
    enemyHpBar.value = enemyCharacter.hp
    playerHpBar.value = playerCharacter.hp
    enemyMpBar.value = enemyCharacter.mp
    playerMpBar.value = playerCharacter.mp
}

function timerUi() {
    if (playwin.timer>0) {
        playwin.timer -= 1/playwin.framerate
        timerEle.textContent = Math.ceil(playwin.timer)        
    }
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
        if(inp === 'z'){
            playerCharacter.fireball(enemyCharacter)
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
//ANCHOR global var and obj
enemyHpBar = document.getElementById('enemy-hp')
playerHpBar = document.getElementById('player-hp')
enemyMpBar = document.getElementById('enemy-mp')
playerMpBar = document.getElementById('player-mp')
timerEle = document.getElementById('timer')

playwin = {
    height: 450,
    width: 800,
    element: document.getElementById('play-window'),
    mute: false,
    pause: true,
    frame: 0,
    framerate: 30,
    timer: 99,
    gameOver: false
};
playerEle = document.getElementById('player')

let playerAttack = new attackClass(
    100,0,50,50,document.getElementById('player-attack')
)

let playerCharacter = new playerClass(
    0,0,playerEle,'guy',playerAttack, 
    +playerEle.getAttribute('hp'), 
    +playerEle.getAttribute('mp'), 
    +playerEle.getAttribute('atk'), 
    +playerEle.getAttribute('def'), 
    +playerEle.getAttribute('spatk'), 
    +playerEle.getAttribute('spdef'), 
)

playerAttack.user = playerCharacter

let enemyCharacter = new enemyClass(
    400,300,document.getElementById('enemy'),'sdf',null, 100, 100, 10, 5, 5, 5
)

game()
assignEvents()
mute()

console.log(playerCharacter.hp)
