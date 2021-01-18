statStr=['health','mana','attack','defence','spclAttack','spclDefence']

skillpts = 20
document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts


statStr.forEach(stat => {
    const eleUp=document.getElementById(`${stat}-up-stat-btn`)
    eleUp.addEventListener('click',()=>{
        if (skillpts>0) {
            document.getElementById(stat).value = +document.getElementById(stat).value + 1
            skillpts -= 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })

    const eleDn=document.getElementById(`${stat}-down-stat-btn`)
    eleDn.addEventListener('click',()=>{
        if (+document.getElementById(stat).value>0) {
            document.getElementById(stat).value = +document.getElementById(stat).value - 1
            skillpts += 1
            document.getElementById('skillpoints').textContent = 'Skill Points: ' + skillpts
        }
    })


});
