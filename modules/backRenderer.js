import { one_action_link, two_action_link, three_action_link, reaction_link, free_link} from "../modules/provider.js";

function renderBack(cardType, information) {
    // Получить пустой шаблон
    let temp = document.getElementsByTagName("template")[0];
    let card = temp.content.cloneNode(true); // Возвращает DocumentFragment

    // Установить тип карты
    card.querySelector('div').classList.add(cardType);

    // Содержимое карты
    let body = card.querySelector('.text-pf');

    // Разделитель от основного текста
    appendText(body, information.backText);

    return card;
}

function appendText(body, text) {
    if (text == null)
        return;

    let content = text.replace('(a)', one_action_link).replace('(aa)', two_action_link).replace('(aaa)', three_action_link).replace('(r)', reaction_link).replace('(f)', free_link);
    body.innerHTML += content;
}


export { renderBack }