function Stats() {
    
    
    statStr=['health','mana','attack','defence','spclAttack','spclDefence']
    
    stat=[]
    
    for (let i = 0; i < statStr.length; i++) {
        stat.push(document.getElementById(statStr[i]))
        
    }
    
    
    
    skillpts = (
        +document.getElementById('skillpoints').textContent
        )
        
        
        
        document.getElementById('skillpoints').textContent = skillpts

        
    for (let i = 0, eleUp = null; i < 2; i++) {
        eleUp=document.getElementById(`${statStr[i]}-up-stat-btn`)
        eleUp.addEventListener('click',()=>{
            if (skillpts>0) {
                stat[i].value = +stat[i].value + 20
                skillpts -= 1
                document.getElementById('skillpoints').textContent = skillpts
            }
        })
        
        const eleDn=document.getElementById(`${statStr[i]}-down-stat-btn`)
        eleDn.addEventListener('click',()=>{
            if (+stat[i].value>0 && +stat[i].value>20) {
                stat[i].value = +stat[i].value - 20
                skillpts += 1
                document.getElementById('skillpoints').textContent = skillpts
            }
        })
        
    }



    for (let i = 2, eleUp = null; i < statStr.length; i++) {
        eleUp=document.getElementById(`${statStr[i]}-up-stat-btn`)
        eleUp.addEventListener('click',()=>{
            if (skillpts>0) {
                stat[i].value = +stat[i].value + 1
                skillpts -= 1
                document.getElementById('skillpoints').textContent = skillpts
            }
        })
        
        const eleDn=document.getElementById(`${statStr[i]}-down-stat-btn`)
        eleDn.addEventListener('click',()=>{
            if (+stat[i].value>0 && +stat[i].value>1) {
                stat[i].value = +stat[i].value - 1
                skillpts += 1
                document.getElementById('skillpoints').textContent = skillpts
            }
        })
        
    }

}
function err() {
    const error = document.getElementById('error-message')
    error.textContent = window.location.search.split('%22')[1].replaceAll('%20',' ')
    error.classList.remove('hidden')

}