import {createCard} from '../modules/generator.js';
import {getSpells} from '../modules/provider.js';
import { getSelectValues } from '../modules/utility.js';

function getFilteredSpells() {
    let name = document.getElementById('spellNameField').value;
    let cardType = document.getElementById('cardTypeField').value;
    let components = getSelectValues(document.getElementById('castComponentsField'));
    let levels = getSelectValues(document.getElementById('levelField'));

    let spells = getSpells(name, cardType, components, levels);
    return spells;
}

function render() {
    let count = 0;
    let collection = document.getElementsByClassName("collection")[0];
    let printable = document.getElementsByClassName("printable")[0];
    let cardType = document.getElementById('cardTypeField').value;

    // Сбросить коллекции
    collection.innerHTML = '';
    printable.innerHTML = '';

    let page = initializePage(printable);
    let spells = getFilteredSpells();

    for(let element of spells)
    {
        let cards = createCard(cardType, element, collection);

        for(let card of cards) {
            let copy = card.cloneNode(true);
            page.append(copy);
            count = count + 1;

            // Каждые 9 карт создаем новую страницу
            if (count > 0 && count % 9 == 0)
                page = initializePage(printable);
        }
    }
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

document.getElementById('showButton').addEventListener('click', render);
document.getElementById('printButton').addEventListener('click', showPrint);