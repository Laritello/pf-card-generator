import { render } from '../modules/renderer.js';
import { createCard } from '../modules/generator.js';
import { getSpells, getManualSpells } from '../modules/provider.js';
import { getSelectValues, getCardHeader } from '../modules/utility.js';

let template = $('#card_collection_template').html();
let renderCardHtml = doT.template(template, undefined, undefined);
var spells = null;


function getFilteredSpells(sourceType) {
    let name = document.getElementById('spellNameField').value;
    let cardType = document.getElementById('cardTypeField').value;
    let components = getSelectValues(document.getElementById('castComponentsField'));
    let levels = getSelectValues(document.getElementById('levelField'));

    switch(sourceType) {
        case 'auto': return getSpells(name, cardType, components, levels);
        case 'manual': return getManualSpells(name, cardType, components, levels);
    }
}

function show() {
    let collection = document.getElementsByClassName("collection")[0];
    let printable = document.getElementsByClassName("printable")[0];
    let cardType = document.getElementById('cardTypeField').value;
    let sourceType = document.getElementById('sourceTypeField').value;

    // Сбросить коллекции
    collection.innerHTML = '';
    printable.innerHTML = '';

    let page = initializePage(printable);
    spells = getFilteredSpells(sourceType);
    let spell_groups = spells.chunks(9);

    console.log(spell_groups);
    
    let content = renderCardHtml({ 'pages': spell_groups, 'cardType': cardType, 'cardTypeName': getCardHeader(cardType) });

    $('.collection').html(content);

    // switch (sourceType) {
    //     case 'auto':
    //         spells.forEach(element => {
    //             let cards = createCard(cardType, element, collection);
        
    //             cards.forEach(card => {
    //                 let copy = card.cloneNode(true);
    //                 page.append(copy);
    //                 count = count + 1;
        
    //                 // Каждые 9 карт создаем новую страницу
    //                 if (count > 0 && count % 9 == 0)
    //                     page = initializePage(printable);
    //             })
    //         });
    //         break;
    //     case 'manual':
    //         spells.forEach(element => {
    //             let cards = render(cardType, element);
        
    //             cards.forEach(card => {
    //                 collection.append(card);
                    
    //                 let nodes = collection.querySelectorAll('.card');
    //                 let attached = nodes[nodes.length -1];
        
    //                 let copy = attached.cloneNode(true);
    //                 page.append(copy);
    //                 count = count + 1;
        
    //                 // Каждые 9 карт создаем новую страницу
    //                 if (count > 0 && count % 9 == 0)
    //                     page = initializePage(printable);
    //             })
    //         });
    //         break;
    // };
}

function initializePage(parent) {
    let page = document.createElement('div');
    page.classList.add('printable-page');
    parent.append(page);

    return page;
}

function showPrint() {
    window.print();  
}

document.getElementById('showButton').addEventListener('click', show);
document.getElementById('printButton').addEventListener('click', showPrint);