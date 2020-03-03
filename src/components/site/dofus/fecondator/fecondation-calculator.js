function calculFecondation() {
  $('.top-infos')[0].innerHTML = '';
  $('.top-infos').hide();
  $('.principal-container')[0].innerHTML = '';
  $('.principal-container')[0].className = 'principal-container';
  const infos_title = create_h('h2', 'infos-title text-center', 'Calculer les fécondations');
  $('.principal-container')[0].appendChild(infos_title);
  const ressourceDiv = create_div('text-center principal-parcho-div');
  if (json['Mes dragodindes'].length) {
    if (json.last[0]) {
      calculate_with_last(ressourceDiv);
    } else {
      calculate_without_last(ressourceDiv);
    }
  } else {
    if (json.last[0]) {
      const date_accouchement = moment(json.last[1], 'DD/MM/YYYY HH:mm').add(json.last[2], 'hours');
      const accouchDate = create_h('h4', 'text-center accouch-date', `Accouchement le : ${date_accouchement.format('DD/MM/YYYY HH:mm')}`);
      $('.principal-container')[0].appendChild(accouchDate);
    }
    ressourceDiv.appendChild(create_p('no-dd-title', 'Aucune dragodinde'));
    $('.principal-container')[0].appendChild(ressourceDiv);
  }
  const bottomChoice = create_div('bottom-choice');
  render_home_button(bottomChoice);
  $('.principal-container')[0].style.maxHeight = `${$(window).height() - $('.bottom-choice').height()}px`;
}

function calculate_without_last(ressourceDiv) {
  const date_accouchement = moment();
  let last_time = 0;
  let addHours = 0;
  const sortedMyDD = sort_my_dd();
  const parchoContainer = create_div('parcho-container');
  sortedMyDD.map((drago, index) => {
    const divLine = create_div('ressource-line row');
    const pName = create_p('fecond-name', drago.name);
    divLine.appendChild(pName);
    let pLine;
    if (index == 0) {
      date_accouchement.add(drago.time, 'hours');
      pLine = create_p('fecond-count fecond-now', 'Maintenant');
      last_time = drago.time;
    } else if (drago.time < last_time) {
      addHours = (last_time - drago.time) + addHours;
      pLine = create_p('fecond-count', `Dans ${addHours}H - ${moment().add(addHours, 'hours').format('DD/MM/YYYY HH:mm')}`);
      last_time = drago.time;
    } else if (addHours) {
      pLine = create_p('fecond-count', `Dans ${addHours}H - ${moment().add(addHours, 'hours').format('DD/MM/YYYY HH:mm')}`);
    } else {
      pLine = create_p('fecond-count fecond-now', 'Maintenant');
    }
    divLine.appendChild(pLine);
    parchoContainer.appendChild(divLine);
    ressourceDiv.appendChild(parchoContainer);
  });
  const accouchDate = create_h('h4', 'text-center accouch-date', `Accouchement le : ${date_accouchement.format('DD/MM/YYYY HH:mm')}`);
  $('.principal-container')[0].appendChild(accouchDate);
  $('.principal-container')[0].appendChild(ressourceDiv);
}

function calculate_with_last(ressourceDiv) {
  let date_accouchement = moment();
  let last_time = 0;
  let addHours = 0;
  let minutes = 0;
  const sortedMyDD = sort_my_dd();
  const parchoContainer = create_div('parcho-container');
  sortedMyDD.map((drago, index) => {
    const divLine = create_div('ressource-line row');
    const pName = create_p('fecond-name', drago.name);
    divLine.appendChild(pName);
    let pLine;
    if (index == 0) {
      if (json.last[2] - drago.time == 0) {
        pLine = create_p('fecond-count fecond-now', 'Maintenant');
        date_accouchement = moment(json.last[1], 'DD/MM/YYYY HH:mm').add(json.last[2], 'hours');
      } else {
        const ddTime = moment(json.last[1], 'DD/MM/YYYY HH:mm').add(json.last[2] - drago.time, 'hours');
        const duration = momentR.range(ddTime, moment());
        const hours = Array.from(duration.by('hour', { excludeEnd: true }));
        const days = Array.from(duration.by('day', { excludeEnd: true }));
        minutes = Array.from(duration.by('minute', { excludeEnd: true })).length;
        minutes = minutes - (hours.length * 60)
        const oneAccouchDate = moment().add(hours.length, 'hours').add(minutes, 'minute');
        if (hours.length > 0) {
          if (days.length >= 1) {
            pLine = create_p('fecond-count fecond-now', 'Maintenant');
            addHours = 0;
            date_accouchement = moment().add(drago.time, 'hours');
          } else {
            if (moment().isAfter(ddTime)) {
              pLine = create_p('fecond-count fecond-now', `Maintenant`);
              addHours = 0;
            }
            else {
              pLine = create_p('fecond-count', `Dans ${hours.length}H | ${oneAccouchDate.format('DD/MM/YYYY HH:mm')}`);
              addHours = hours.length;
            }
            date_accouchement = moment(json.last[1], 'DD/MM/YYYY HH:mm').add(json.last[2], 'hours');
          }
        } else {
          date_accouchement = moment().add(drago.time, 'hours');
          pLine = create_p('fecond-count fecond-now', 'Maintenant');
        }
      }
      last_time = drago.time;
    } else {
      if (drago.time < last_time) {
        addHours = (last_time - drago.time) + addHours;
        pLine = create_p('fecond-count', `Dans ${addHours}H | ${moment().add(addHours, 'hours').add(minutes, 'minute').format('DD/MM/YYYY HH:mm')}`);
      } else if (addHours) {
        pLine = create_p('fecond-count', `Dans ${addHours}H | ${moment().add(addHours, 'hours').add(minutes, 'minute').format('DD/MM/YYYY HH:mm')}`);
      } else {
        pLine = create_p('fecond-count fecond-now', 'Maintenant');
      }
      last_time = drago.time;
    }
    divLine.appendChild(pLine);
    parchoContainer.appendChild(divLine);
    ressourceDiv.appendChild(parchoContainer);
  });
  const accouchDate = create_h('h4', 'text-center accouch-date', `Accouchement le : ${date_accouchement.format('DD/MM/YYYY HH:mm')}`);
  if (json.last[0] != '') {
    const topTitle = create_h('h4', 'text-center accouch-last', `Dernière : ${json.last[0]}`);
    $('.principal-container')[0].appendChild(topTitle);
  }
  $('.principal-container')[0].appendChild(accouchDate);
  $('.principal-container')[0].appendChild(ressourceDiv);
}

function sort_my_dd() {
  const myDD = [];
  json['Mes dragodindes'].map((drago) => {
    let selectedDragoName;
    let selectedDragoTime;
    dragodindes.map((dragodinde) => {
      if (dragodinde[0][0] == drago) {
        selectedDragoName = dragodinde[0][0];
        selectedDragoTime = dragodinde[1][0].substr(0, dragodinde[1][0].length - 1);
        myDD.push({ time: parseInt(selectedDragoTime), name: selectedDragoName });
      }
    });
  });
  return _.reverse(_.sortBy(myDD, 'time'));
}
