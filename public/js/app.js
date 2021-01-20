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
        this.element.style.transform = `translate(${this.x-this.width*(this.direction<0)}px,${this.y}px) rotateZ(${this.rotation}deg) scaleX(${this.direction})`
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
    runFrom(target) {
        if (this.x > target.x) {
            this.move.ri = true;
            this.move.lf = false;
        } else {
            this.move.ri = false;
            this.move.lf = true;
        }
        if (this.y < target.y) {
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
class fighter extends interObj {
    constructor(x, y, element, name, HitBox) {
        super(x, y,100, 150, element)
        this.name = name
        this.hp=100
        this.mp=100
        this.atk=5
        this.def=5
        this.spAtk=5
        this.spDef=5
        this.Ospd =5
        this.control = true
        this.HitBox = HitBox
        this.airborne = true
        this.cooldown = false
        this.exp = 100
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

    attack(target){
        this.moveLag(10)
        this.attackAnimation()
        setTimeout(()=>{
            if (this.HitBox.collision(target)) {
            if(this.atk > target.def){
                target.hp -= this.atk - target.def
            } else {
                target.hp -= 2
            }
            this.hitstun(5,20,target)
        }    
        },1000/playwin.framerate*5)

    }
    hitstun(frames,knockback,target){
        target.xSpd = knockback*this.direction
        let knockbackDirection = null
        if (this.direction>0) {
            knockbackDirection = target.move.ri
        } else {
            knockbackDirection = target.move.lf
        }
        

        knockbackDirection = false
        const stun = setInterval(()=>{
            if (knockbackDirection) {
                knockbackDirection = false
                target.control = true
                target.xSpd = target.Ospd
                clearInterval(stun)
            }

        },1000/playwin.framerate*frames)
        knockbackDirection = true
        target.control = false
    }

    moveLag(frames){
        this.stop()
        const cooldown = setInterval(()=>{
            if (this.cooldown) {
                this.cooldown = false
                this.control = true
                this.xSpd = this.Ospd
                clearInterval(cooldown)
            }
        },1000/playwin.framerate*frames)
        this.cooldown = true
        this.control = false
    }


    fireball(target){
        this.moveLag(30)
        if (this.mp >= 10) {
            
            const  fire = document.createElement('div')
            fire.classList.add("fire")
            // fire.classList.add("hitbox")
            fire.classList.add("hidden")
            
            playwin.element.appendChild(fire)
            
            const fireball = new fireballClass(
                this.x+this.width*(this.direction>0)*this.direction,this.y+80,fire,this.direction,this
            )
                
            fireball.launch(target)
            this.mp -= 10
        }
                

    }
    jump(){
        if(!this.airborne){
            this.ySpd = 20
            this.airborne = true
        }
    }
    gravity() {
        if(this.airborne && this.y - this.ySpd >= this.yMax){
            this.airborne=false
            this.ySpd = 0
        }
        if(this.airborne){
            
            this.ySpd -= playwin.gravAcc
            this.move.up = true
        }else {
            this.y = this.yMax - 10
        }
    }
    update(){
        this.gravity()
        this.facing()
        this.moveFunction()
        this.Ai()
    }
    facing(){
        if(this.x < this.opponent.x){
            this.direction = 1
        }else {
            this.direction = -1
        }
    }
    attackAnimation(){
        let i=0
        const st = setInterval(()=>{
            if(!playwin.pause){
                this.rotation += 10*this.direction
                i++
                if (i >= 3 && i < 6) {
                    this.rotation -= 20*this.direction
                }else if(i>=6){
                    this.rotation = 0
                    clearInterval(st)
                }
            }


        },1000/playwin.framerate)
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

    }
    Ai(){

    }

}
class enemyClass extends fighter {
    constructor(x, y, element, name, HitBox, hp, mp, atk, def, spAtk, spDef) {
        super(x, y, element, name, HitBox)
        this.hp=hp
        this.mp=mp
        this.atk=atk
        this.def=def
        this.spAtk=spAtk
        this.spDef=spDef
        this.xSpd  = 5;
        this.control = true
        this.conditions = ['attack', 'fireball', 'approach', 'backoff', 'jump', 'idle']
        this.currentState = 'idle'
    }
    Ai() {
        this.behavior()
        if (this.control) {
            
            
            if (this.currentState === this.conditions[0]) {
                this.stateAttack()
            }
            if (this.currentState === this.conditions[1]) {
                this.stateFireball()
            }
            if (this.currentState === this.conditions[2]) {
                this.stateApproach()
            }
            if (this.currentState === this.conditions[3]) {
                this.stateBackoff()
            }
            if (this.currentState === this.conditions[4]) {
                this.stateJump()
            }
            if (this.currentState === this.conditions[5]) {
                this.stateIdle()
            }
        }

    }
    behavior(){
        if(!(playwin.frame%30)){
            const thought = getRand(5,0)
            this.currentState = this.conditions[thought]
            // console.log(this.currentState);
        }

    }
    stateAttack(){
        this.attack(this.opponent)
    }
    stateFireball(){
        this.fireball(this.opponent)
    }
    stateApproach(){
        this.trackdown(this.opponent)
    }
    stateBackoff(){
        this.runFrom(this.opponent)
    }
    stateJump(){
        this.jump()
    }
    stateIdle(){

    }
    trackdown(target) {
        if (this.x < target.x) {
            this.move.ri = true;
            this.move.lf = false;
        } else {
            this.move.ri = false;
            this.move.lf = true;
        }
    }
    runFrom(target) {
        if (this.x > target.x) {
            this.move.ri = true;
            this.move.lf = false;
        } else {
            this.move.ri = false;
            this.move.lf = true;
        }
    }

}
class fireballClass extends interObj {
    constructor(x, y, element, direction,user) {
        super(x, y, 40, 20, element)
        this.direction = direction
        this.xSpd = 3;
        this.user = user
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
            if(!playwin.pause){

                this.moveFunction()
                if(this.collision(target)){
                    if(this.user.spAtk > target.spDef){
                        target.hp -= this.user.spAtk*3 - target.spDef + 10
                    } else {
                        target.hp -= 10
                    }
                    this.element.remove()
                    this.user.hitstun(5,5,target)
                    clearInterval(launch);
                }
                if (this.x - this.xSpd <= this.xMin) {
                    this.element.remove()
                    clearInterval(launch);
                }
                if (this.x + this.xSpd >= this.xMax) {
                    this.element.remove()
                    clearInterval(launch);
                }
            }
                
    },1000/playwin.framerate)
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

//ANCHOR update each frame
function update() {
    if (!playwin.pause) {
        uiUpdate();
        movement();
        playerCharacter.update();
        enemyCharacter.update();
        if(playwin.frame === playwin.framerate){
            playwin.frame = 0
        }


        if(playerCharacter.hp<=0 || enemyCharacter.hp <=0 || playwin.timer <= 0){
            playwin.gameOver = true
        }
        playwin.frame++
    }
}

function movement() {
    playerAttack.moveFunction()
    enemyAttack.moveFunction()
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
    if (enemyCharacter.hp/(+enemyHpBar.getAttribute('max')) > playerCharacter.hp/(+playerHpBar.getAttribute('max'))) {
        document.getElementById('notification-message').innerHTML=`${enemyCharacter.name} Wins`
    } else if (enemyCharacter.hp/(+enemyHpBar.getAttribute('max')) < playerCharacter.hp/(+playerHpBar.getAttribute('max'))) {
        document.getElementById('notification-message').innerHTML=`${playerCharacter.name} Wins <br> ${+enemyCharacter.element.getAttribute('exp')}xp gained`
        const exp = +playerCharacter.element.getAttribute('exp') + +enemyCharacter.element.getAttribute('exp')
        document.getElementById('exp').value = exp
        playerCharacter.element.setAttribute('exp',exp)
        document.getElementById('level-display').value = Math.floor(Math.log(9*(exp)/100)/Math.log(3))

    } else{
        document.getElementById('notification-message').innerHTML=`Tie`
    }
    document.getElementById('notification-area').classList.remove('hidden')

}

function Init() {

    // $("#music")[0].play();
    playerCharacter.hp = +playerHpBar.getAttribute('max')
    enemyCharacter.hp = +enemyHpBar.getAttribute('max')
    playerCharacter.mp = +playerMpBar.getAttribute('max')
    enemyCharacter.mp = +enemyMpBar.getAttribute('max')
    playerCharacter.x = playerInit.x
    playerCharacter.y = playerInit.y
    enemyCharacter.x = enemyInit.x
    enemyCharacter.y = enemyInit.y
    playerCharacter.airborne = true
    enemyCharacter.airborne = true
    playwin.gameOver = false
    playwin.pause = false
    playwin.timer = 99
    document.getElementById('notification-area').classList.add('hidden')
    document.getElementById('exp').value = playerCharacter.element.getAttribute('exp') 
    document.getElementById('level-display').value = Math.floor(Math.log(9*(+playerCharacter.element.getAttribute('exp'))/100)/Math.log(3))
    document.querySelectorAll('.fire').forEach(fire=>{
        fire.remove()
    })

}

function pause() {
    if (!playwin.gameOver) {
        playwin.pause = !playwin.pause
        if (playwin.pause) {
            // $("#music")[0].pause()
        } else {
            // $("#music")[0].play()
        }
        if (playwin.pause) {
            document.getElementById('pause-message').innerHTML=`Paused`
            document.getElementById('pause-area').classList.remove('hidden')
        } else {
            document.getElementById('pause-area').classList.add('hidden')
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

function controlToggle() {
    if (playwin.controlMode === 'arrow') {
        playwin.controlMode = 'wasd'
        document.getElementById('control-toggle').innerText = 'wasd'
    } else {
        playwin.controlMode = 'arrow'
        document.getElementById('control-toggle').innerText = 'Arrows'
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

    document.getElementById('notification-area').addEventListener('click',game)
    document.getElementById('control-toggle').addEventListener('click',controlToggle)
    window.addEventListener("keydown", getKey);
    window.addEventListener("keyup", releaseKey);

}

function getKey(event) {
    controller(event.key)   
}

function controller(inp){
    if(playerCharacter.control){
    if(playwin.controlMode === 'arrow'){
        if(inp === 'ArrowUp'){
            if (!playerCharacter.airborne) {
                playerCharacter.jump()
            }
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
    } else if(playwin.controlMode === 'wasd'){

            if(inp === 'w'){
                if (!playerCharacter.airborne) {
                    playerCharacter.jump()
                }
            }
            if(inp === 's'){
                playerCharacter.move.dn = true
            }
            if(inp === 'a'){
                playerCharacter.move.lf = true
            }
            if(inp === 'd'){
                playerCharacter.move.ri = true
            }
            if(inp === ' '){
                playerCharacter.attack(enemyCharacter)
            }
            if(inp === 'Shift'){
                playerCharacter.fireball(enemyCharacter)
            }
        
        }
    }

    if(inp === 'p'){
        pause()
    }
    
    // console.log(inp)
    // console.log(playerCharacter.move);
}

function releaseKey(inp) {
    if(playerCharacter.control){
        if(playwin.controlMode === 'arrow'){
            if(inp.key === 'ArrowUp'){
                // playerCharacter.move.up = false
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
        } else if(playwin.controlMode === 'wasd'){
    
            if(inp.key === 'w'){
                // playerCharacter.move.up = false
            }
            if(inp.key === 's'){
                playerCharacter.move.dn = false
            }
            if(inp.key === 'a'){
                playerCharacter.move.lf = false
            }
            if(inp.key === 'd'){
                playerCharacter.move.ri = false
            
            }
        }

    }
}


//ANCHOR global var and obj
enemyHpBar = document.getElementById('enemy-hp')
playerHpBar = document.getElementById('player-hp')
enemyMpBar = document.getElementById('enemy-mp')
playerMpBar = document.getElementById('player-mp')
timerEle = document.getElementById('timer')

playwin = {
    height: 400,
    width: 800,
    element: document.getElementById('play-window'),
    mute: false,
    pause: true,
    frame: 0,
    framerate: 30,
    timer: 99,
    gameOver: false,
    gravAcc: 1,
    controlMode: 'arrow'
};
playerEle = document.getElementById('player')
enemyEle = document.getElementById('enemy')

playerInit= {
    x:0,
    y:0
}
enemyInit= {
    x:700,
    y:0
}

let playerAttack = new attackClass(
    playerInit.x+100,playerInit.y,50,50,document.getElementById('player-attack')
)
let enemyAttack = new attackClass(
    enemyInit.x-50,enemyInit.y,50,50,document.getElementById('enemy-attack')
)

let playerCharacter = new playerClass(
    playerInit.x,
    playerInit.y,
    playerEle,
    playerEle.getAttribute('name'),
    playerAttack, 
    +playerEle.getAttribute('hp'), 
    +playerEle.getAttribute('mp'), 
    +playerEle.getAttribute('atk'), 
    +playerEle.getAttribute('def'), 
    +playerEle.getAttribute('spatk'), 
    +playerEle.getAttribute('spdef'), 
)

let enemyCharacter = new enemyClass(
    enemyInit.x,
    enemyInit.y,
    document.getElementById('enemy'),
    enemyEle.getAttribute('name'),
    enemyAttack, 
    +enemyEle.getAttribute('hp'), 
    +enemyEle.getAttribute('mp'), 
    +enemyEle.getAttribute('atk'), 
    +enemyEle.getAttribute('def'), 
    +enemyEle.getAttribute('spatk'), 
    +enemyEle.getAttribute('spdef'), 
)

playerAttack.user = playerCharacter
enemyAttack.user = enemyCharacter

playerCharacter.opponent = enemyCharacter
enemyCharacter.opponent = playerCharacter



game()
assignEvents()
mute()

// let xhr = new XMLHttpRequest
// xhr.open('GET',