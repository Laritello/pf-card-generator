import { one_action_link, two_action_link, three_action_link, reaction_link, free_link} from "../modules/provider.js";
import { getOverflownElements } from "../modules/utility.js";

function createCard(cardType, information, collection) {
    // Получить пустой шаблон
    let temp = document.getElementsByTagName("template")[0];
    let card = temp.content.cloneNode(true); // Возвращает DocumentFragment

    // Установить тип карты
    card.querySelector('div').classList.add(cardType);

    // Установить заголовок карты
    card.querySelector('.header').innerHTML = getCardHeader(cardType);

    // Установить имя карты
    card.querySelector('#nameField').innerHTML = information.name_ru;

    // Установить уровень карты
    card.querySelector('#levelField').innerHTML = getLevelText(information);

    // Установить оригинальное имя
    card.querySelector("#engNameField").innerHTML = information.name_en;
    // Добавить теги
    appendTraits(information.traits, card.querySelector("#nameSeparator"));

    // Содержимое карты
    let body = card.querySelector('.text-pf');
    collection.append(card);
    let nodes = collection.querySelectorAll('.card');
    let mainCard = nodes[nodes.length -1];

    // Добавить обычаи
    appendTraditions(body, information.tradition);

    // Добавить сотворение
    appendCast(body, information.cast);

    // Добавить дистаницию, область и цели
    appendRangeAreaAndTargets(body, information.distance, information.area, information.target);

    // Добавить спасбросок и продолжительность
    appendSavingThrowAndDuration(body, information.saves, information.duration);

    // Разделитель от основного текста
    appendSeparator(body);

    // Добавить основной текст
    appendDescription(body, information);
    appendHeightened(body, information);


    // Если в ходе заполнение карточки произошло переполнение контента
    // создаем заднюю сторону карточки
    let overflown = getOverflownElements(body);
    if (overflown.length > 0) {
        let secondaryCard = createSecondaryCard(cardType, information, collection, overflown);
        return [mainCard, secondaryCard];
    }

    return [mainCard];

    
}

function createSecondaryCard(cardType, information, collection, overflown) {
    // Получить пустой шаблон
    let temp = document.getElementsByTagName("template")[1];
    let card = temp.content.cloneNode(true); // Возвращает DocumentFragment

    // Установить тип карты
    card.querySelector('div').classList.add(cardType);

    // Установить заголовок карты
    card.querySelector('.header').innerHTML = getCardHeader(cardType);

    // Установить оригинальное имя
    card.querySelector("#engNameField").innerHTML = information.name_en;

    // Содержимое карты
    let body = card.querySelector('.text-pf');
    collection.append(card);
    let nodes = collection.querySelectorAll('.card');

    $(body).append(overflown);

    // TODO: Добавить оповещение о том, что это продолжение карты
    return card;
}

function getCardHeader(cardType) {
    let header = "";

    switch (cardType) {
        case "arcane" : header = "Арканное"; break;
        case "primal" : header = "Природное"; break;
        case "divine" : header = "Сакральное"; break;
        case "occult" : header = "Оккультное"; break;
        case "focus" : header = "Фокус"; break;
    };

    return header;
}

function getLevelText(information) {
    if (information.traits != null && information.traits.includes('чары'))
        return "чары " + information.level;
    else
        return "закл. " + information.level;
}

function appendTraits(traits, separator) {
    if (traits == null)
        return;

    let temp = document.getElementsByTagName("template")[2];
    traits.forEach(element => {
        if (element == 'редкий' || element == 'необычный')
            return;
        
        // Получить пустой шаблон
        let trait = temp.content.cloneNode(true); // Возвращает DocumentFragment
        trait.querySelector("div").innerHTML = element;

        separator.after(trait);
    });

    if (traits.includes('необычный')) {
        // Получить пустой шаблон
        let trait = temp.content.cloneNode(true); // Возвращает DocumentFragment
        trait.querySelector('div').classList.add('pf-trait-uncommon');
        trait.querySelector("div").innerHTML = 'необычный';

        separator.after(trait);
    }

    if (traits.includes('редкий')) {
        // Получить пустой шаблон
        let trait = temp.content.cloneNode(true); // Возвращает DocumentFragment
        trait.querySelector('div').classList.add('pf-trait-rare');
        trait.querySelector("div").innerHTML = 'редкий';

        separator.after(trait);
    }
}

function appendTraditions(body, traditions) {
    if (traditions == null || traditions.length == 0)
        return;

    let paragraph = document.createElement("p");
    paragraph.classList.add('hang');
    paragraph.innerHTML = "<strong>Обычай</strong> " + traditions.join(', ');
    body.append(paragraph);
}

function appendCast(body, cast) {
    if (cast == null)
        return;

    let content = cast.replace('(a)', one_action_link).replace('(aa)', two_action_link).replace('(aaa)', three_action_link).replace('(r)', reaction_link).replace('(f)', free_link);

    let paragraph = document.createElement("p");
    paragraph.classList.add('hang');
    paragraph.innerHTML = "<strong>Каст</strong> " + content;
    body.append(paragraph);
}

function appendRangeAreaAndTargets(body, distance, area, targets) {
    if (distance == null && area == null && targets == null)
        return;

    let content = "";

    if (distance != null) {
        content += "<strong>Дистанция</strong> " + distance;
    }

    if (area != null) {
        if (distance != null) {
            content += "; <strong>Область</strong> " + area;
        } else{
            content += "<strong>Область</strong> " + area;
        }
    }

    if (targets != null) {
        if (distance != null || area != null) {
            content += ";";
        }

        if (distance == null && area == null) {
            content += "<strong>Цели</strong> " + targets;
        }
        else {
            content += " <strong>Цели</strong> " + targets;
        }
    }

    let paragraph = document.createElement("p");
    paragraph.classList.add('hang');
    paragraph.innerHTML = content;
    body.append(paragraph);
}

function appendSavingThrowAndDuration(body, savingThrow, duration) {
    if (savingThrow == null && duration == null)
        return;

    let content = "";

    if (savingThrow != null) {
        content += "<strong>Спасбросок</strong> " + savingThrow;
    }

    if (duration != null) {
        if (savingThrow != null) {
            content += "; <strong>Продолжительность</strong> " + duration;
        } else{
            content += "<strong>Продолжительность</strong> " + duration;
        }
    }

    let paragraph = document.createElement("p");
    paragraph.classList.add('hang');
    paragraph.innerHTML = content;
    body.append(paragraph);
}

function appendDescription(body, information) {
    if (information.description == null)
        return;

    for (let i = 0; i < information.description.length; i++) {
        // Заменяем в строке указатели на картинки действий самими картинками
        let content = information.description[i]
            .replace('(a)', one_action_link)
            .replace('(aa)', two_action_link)
            .replace('(aaa)', three_action_link)
            .replace('(r)', reaction_link)
            .replace('(f)', free_link)
            .replace('<p>', '<p class="heighten">');
        
        // let temp = body.innerHTML; // Сохраняем оригинальное состояние контента до добавления нового параграфа
        // body.innerHTML += content; // Добавляем новый параграф

        $(body).append(content);

        // Проверяем вмещается ли он
        // if (isOverflown(body)) {
        //     // $(body).find('p:last').remove();
        //     body.innerHTML = temp;      // Если не вмещается - убираем текущий параграф из контента
        //     return [ 'description', i]; // И возвращаем указатель на место переполнения
        // }
    }

    

}

function appendHeightened(body, information) {
    if (information.heightened == null)
        return;

    // Отделяем от описания заклинания чертой
    appendSeparator(body);

    for (let i = 0; i < information.heightened.length; i++) {
        // Заменяем в строке указатели на картинки действий самими картинками
        let content = information.heightened[i]
            .replace('(a)', one_action_link)
            .replace('(aa)', two_action_link)
            .replace('(aaa)', three_action_link)
            .replace('(r)', reaction_link)
            .replace('(f)', free_link)
        // Добавляем параграфам класс, для форматирования
            .replace('<p>', '<p class="heighten">');
        $(body).append(content);
    }
}

function appendDescriptionByIndex(body, information, index) {
    if (information.description == null)
        return;

    for (let i = index; i < information.description.length; i++) {
        if (isOverflown(body)) {
            return;
        }

        let content = information.description[i].replace('(a)', one_action_link).replace('(aa)', two_action_link).replace('(aaa)', three_action_link).replace('(r)', reaction_link).replace('(f)', free_link);
        
        body.innerHTML += content;
    }
}

function appendHeightenedByIndex(body, information, index) {
    if (information.heightened == null)
        return;

    appendSeparator(body);

    for (let i = index; i < information.heightened.length; i++) {
        let content = information.heightened[i].replace('(a)', one_action_link).replace('(aa)', two_action_link).replace('(aaa)', three_action_link).replace('(r)', reaction_link).replace('(f)', free_link);
        
        body.innerHTML += content;

        if (isOverflown(body)) {
            return;
        }
    }
}

function appendSeparator(body) {
    let separator = document.createElement('div');
    separator.style = "background: #030200; height: 0.2mm; margin: 0 0 0.8mm 0;";
    body.append(separator);
}

export { createCard };