function show_craft() {
  $('.top-infos')[0].innerHTML = '';
  $('.top-infos').hide();
  $('.principal-container')[0].innerHTML = '';
  $('.principal-container')[0].className = 'principal-container';
  const titleH = create_h('h2', 'craft-title text-center', 'Catégories');
  $('.principal-container')[0].appendChild(titleH);

  const categoryDiv = create_div('text-center category-div');
  make_content(categoryDiv, crafts.sort());
}

function make_content(categoryDiv, array, selectItem = false, selectedCategory = '') {
  array.map((craft, index) => {
    let oneCategory;
    if (selectedCategory && selectedCategory == 'Baffeur' || selectedCategory == 'Caresseur' ||
    selectedCategory == 'Foudroyeur' || selectedCategory == 'Mangeoire' || selectedCategory == 'Abreuvoir') {
      oneCategory = create_div(`text-left category ${craft[0]} row`);
      const category = create_h('h5', 'craft-category-name', craft[0]);
      oneCategory.appendChild(category);
      const categoryEfficacite = create_h('h5', 'craft-category-efficacite text-right', craft[1][craft[1].length - 3]);
      oneCategory.appendChild(categoryEfficacite);
    } else {
      oneCategory = create_div(`text-center category ${craft[0]}`);
      const category = create_h('h5', false, craft[0]);
      oneCategory.appendChild(category);
    }
    if (index == 0) {
      oneCategory.style.borderTop = '1px solid rgba(92, 92, 92, 0.733)';
      oneCategory.style.borderBottom = '1px solid rgba(92, 92, 92, 0.733)';
    } else {
      oneCategory.style.borderBottom = '1px solid rgba(92, 92, 92, 0.733)';
    }
    oneCategory.style.borderLeft = '1px solid rgba(92, 92, 92, 0.733)';
    oneCategory.style.borderRight = '1px solid rgba(92, 92, 92, 0.733)';
    if (selectItem) {
      oneCategory.onclick = () => { select_item(craft[0], selectedCategory); };
    } else {
      oneCategory.onclick = () => { select_category(craft[0]); };
    }
    categoryDiv.appendChild(oneCategory);
  });
  $('.principal-container')[0].appendChild(categoryDiv);
  appearEffect($(`.${categoryDiv.className.split(' ')[1]}`));
  const bottomChoice = create_div('bottom-choice');
  if (selectItem) {
    const returnCategory = create_button('btn', 'Retourner aux catégories', () => { show_craft(); });
    bottomChoice.appendChild(returnCategory);
  }
  render_home_button(bottomChoice);
  $('.principal-container')[0].style.maxHeight = `${$(window).height() - $('.bottom-choice').height()}px`;
}

function handleInputCraft(e, selectedItem, selectedCategory) {
  $('.principal-ressource-div')[0].innerHTML = '';
  if (Number(e.target.value)) {
    crafts.map((craft) => {
      craft[1].map((item) => {
        if (item[0] == selectedItem && craft[0] == selectedCategory) {
          let divLine;
          item[1].map((ressource, index) => {
            if (index % 2 == 0) {
              divLine = create_div('text-left ressource-line row');
              const pLine = create_p('ressource-name', ressource);
              divLine.appendChild(pLine);
            } else {
              let pLine = '';
              if (ressource < 50) {
                pLine = create_p('ressource-count', ressource * Number(e.target.value));
              } else {
                pLine = create_p('ressource-count', ressource);
              }
              divLine.appendChild(pLine);
              $('.principal-ressource-div')[0].appendChild(divLine);
            }
          });
        }
      });
    });
  } else {
    crafts.map((craft) => {
      craft[1].map((item) => {
        if (item[0] == selectedItem && craft[0] == selectedCategory) {
          let divLine;
          item[1].map((ressource, index) => {
            if (index % 2 == 0) {
              divLine = create_div('text-left ressource-line row');
              const pLine = create_p('ressource-name', ressource);
              divLine.appendChild(pLine);
            } else {
              const pLine = create_p('ressource-count', ressource);
              divLine.appendChild(pLine);
              $('.principal-ressource-div')[0].appendChild(divLine);
            }
          });
        }
      });
    });
  }
}

function select_item(selectedItem, selectedCategory) {
  $('.principal-container')[0].innerHTML = '';
  $('.principal-container')[0].className = 'principal-container';
  const titleH = create_h('h2', 'craft-title text-center', `${selectedCategory} ${selectedItem}`);
  const ressourceDiv = create_div('text-center principal-ressource-div');
  $('.principal-container')[0].appendChild(titleH);
  const inputDiv = create_div('row div-input-craft text-center');
  const inputNbCraft = create_input('input-craft', '', '1');
  inputNbCraft.oninput = (e) => { handleInputCraft(e, selectedItem, selectedCategory); };
  const inputLabelCraft = create_p(false, 'Nombre de craft');
  inputDiv.appendChild(inputLabelCraft);
  inputDiv.appendChild(inputNbCraft);
  $('.principal-container')[0].appendChild(inputDiv);
  crafts.map((craft) => {
    craft[1].map((item) => {
      if (item[0] == selectedItem && craft[0] == selectedCategory) {
        let divLine;
        item[1].map((ressource, index) => {
          if (index % 2 == 0) {
            divLine = create_div('text-left ressource-line row');
            const pLine = create_p('ressource-name', ressource);
            divLine.appendChild(pLine);
          } else {
            const pLine = create_p('ressource-count', ressource);
            divLine.appendChild(pLine);
            ressourceDiv.appendChild(divLine);
          }
        });
      }
    });
  });
  $('.principal-container')[0].appendChild(ressourceDiv);
  const bottomChoice = create_div('bottom-choice');
  const returnChoice = create_button('btn', `Retourner au choix : ${selectedCategory}`, () => { select_category(selectedCategory); });
  const returnCategory = create_button('btn', 'Retourner aux catégories', () => { show_craft(); });
  bottomChoice.appendChild(returnChoice);
  bottomChoice.appendChild(returnCategory);
  render_home_button(bottomChoice);
  $('.principal-container')[0].style.maxHeight = `${$(window).height() - $('.bottom-choice').height()}px`;
}

function select_category(choice) {
  $('.principal-container')[0].innerHTML = '';
  $('.principal-container')[0].className = 'principal-container';
  const titleH = create_h('h2', 'craft-title text-center', choice);
  $('.principal-container')[0].appendChild(titleH);
  const categoryDiv = create_div('text-center category-div');
  crafts.map((craft) => {
    if (craft[0] == choice) {
      make_content(categoryDiv, craft[1], true, craft[0]);
    }
  });
}
