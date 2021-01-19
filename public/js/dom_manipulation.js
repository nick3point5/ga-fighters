statStr=['health','mana','attack','defence','spclAttack','spclDefence']

stat=[]

for (let i = 0; i < statStr.length; i++) {
    stat.push(document.getElementById(statStr[i]))
    
}



skillpts = (
    20+
    +stat[0].value/20+
    +stat[1].value/20+
    +stat[2].value+
    +stat[3].value+
    +stat[4].value+
    +stat[5].value+
    -30
)



document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts


for (let i = 0, eleUp = null; i < 2; i++) {
    eleUp=document.getElementById(`${statStr[i]}-up-stat-btn`)
    eleUp.addEventListener('click',()=>{
        if (skillpts>0) {
            stat[i].value = +stat[i].value + 20
            skillpts -= 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })

    const eleDn=document.getElementById(`${statStr[i]}-down-stat-btn`)
    eleDn.addEventListener('click',()=>{
        if (+stat[i].value>0 && +stat[i].value>20) {
            stat[i].value = +stat[i].value - 20
            skillpts += 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })
    
}



for (let i = 2, eleUp = null; i < statStr.length; i++) {
    eleUp=document.getElementById(`${statStr[i]}-up-stat-btn`)
    eleUp.addEventListener('click',()=>{
        if (skillpts>0) {
            stat[i].value = +stat[i].value + 1
            skillpts -= 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })

    const eleDn=document.getElementById(`${statStr[i]}-down-stat-btn`)
    eleDn.addEventListener('click',()=>{
        if (+stat[i].value>0 && +stat[i].value>1) {
            stat[i].value = +stat[i].value - 1
            skillpts += 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })
    
}


