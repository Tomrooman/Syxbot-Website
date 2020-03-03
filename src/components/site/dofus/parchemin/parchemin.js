function show_parchemin() {
    $('.top-infos')[0].innerHTML = ''
    $('.top-infos').hide()
    $('.principal-container')[0].innerHTML = ''
    $('.principal-container')[0].className = "principal-container"
    let titleH = create_h('h2', 'craft-title text-center', "Parchemins")
    let ressourceDiv = create_div('text-center principal-parcho-div')
    $('.principal-container')[0].appendChild(titleH)
    let input = create_input('input-parcho', '', "Rechercher")
    let parchoContainer = create_div("parcho-container")
    input.oninput = dragodindeKeyPress
    ressourceDiv.appendChild(input)
    dragodindes.map(dragodinde => {
        let divLine = create_div('ressource-line row')
        let pName = create_p("parchemin-name", dragodinde[2])
        divLine.appendChild(pName)
        let pLine = create_p("parchemin-count", dragodinde[0])
        divLine.appendChild(pLine)
        parchoContainer.appendChild(divLine)
    })
    ressourceDiv.appendChild(parchoContainer)
    $('.principal-container')[0].appendChild(ressourceDiv)
    let bottomChoice = create_div('bottom-choice')
    render_home_button(bottomChoice)
    $('.principal-container')[0].style.maxHeight = ($(window).height() - $('.bottom-choice').height()) + "px"
}

function dragodindeKeyPress(e) {
    $(".parcho-container")[0].innerHTML = ''
    dragodindes.map(dragodinde => {
        if (dragodinde[0][0].toLocaleLowerCase().indexOf(e.target.value) != -1 || dragodinde[2][0].toLocaleLowerCase().indexOf(e.target.value) != -1 || e.target.value == '') {
            let divLine = create_div('ressource-line row')
            let pName = create_p("parchemin-name", dragodinde[2])
            divLine.appendChild(pName)
            let pLine = create_p("parchemin-count", dragodinde[0])
            divLine.appendChild(pLine)
            $(".parcho-container")[0].appendChild(divLine)
        }
    })
}