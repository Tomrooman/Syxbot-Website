function show_gestation() {
  $('.principal-container')[0].innerHTML = '';
  $('.principal-container')[0].className = 'principal-container';
  $('.top-infos')[0].innerHTML = '';
  $('.top-infos').hide();
  const titleH = create_h('h2', 'craft-title text-center', 'Gestation des dragodindes');
  const ressourceDiv = create_div('text-center principal-gestation-div');
  $('.principal-container')[0].appendChild(titleH);
  const gestationContainer = create_div('gestation-container');
  let divLine;
  const input = create_input('input-parcho', '', 'Rechercher');
  input.oninput = search_gestation;
  ressourceDiv.appendChild(input);
  dragodindes.map((dragodinde, index) => {
    divLine = create_div('text-left gestation-line row');
    const pLine = create_p('ressource-name', dragodinde[0][0]);
    divLine.appendChild(pLine);
    const pCount = create_p('ressource-count', dragodinde[1][0]);
    divLine.appendChild(pCount);
    gestationContainer.appendChild(divLine);
  });
  ressourceDiv.appendChild(gestationContainer);
  $('.principal-container')[0].appendChild(ressourceDiv);
  const bottomChoice = create_div('bottom-choice');
  render_home_button(bottomChoice);
  $('.principal-container')[0].style.maxHeight = `${$(window).height() - $('.bottom-choice').height() }px`;
}

function search_gestation(e) {
  $('.gestation-container')[0].innerHTML = '';
  dragodindes.map((dragodinde) => {
    if (dragodinde[0][0].toLocaleLowerCase().indexOf(e.target.value) != -1 || e.target.value == '') {
        const divLine = create_div('text-left gestation-line row');
        const pName = create_p('ressource-name', dragodinde[0]);
        divLine.appendChild(pName);
        const pLine = create_p('ressource-count', dragodinde[1]);
        divLine.appendChild(pLine);
        $('.gestation-container')[0].appendChild(divLine);
      }
  });
}
