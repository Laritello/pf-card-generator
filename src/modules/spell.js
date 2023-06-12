import { getOverflownElements, getCardHeader } from "./utility.js";
import { doT } from "./doT.js"

let template = $('#card_back_side').html();
let renderCardBackHtml = doT.template(template, undefined, undefined);

class Spell {
    constructor(id, spell) {
        Object.assign(this, spell);
        this.id = id;
        this.cast = spell.cast.replaceActionMacro();
        this.description = spell.description.replaceActionMacro();
        this.heightened = spell.heightened?.replaceActionMacro();
        this.distanceAreaTarget = null;
        this.savingThrowAndDuration = null;

        this.overflowedCache = null;
    }

    getLevel() {
        let type = this.traits.includes('чары') ? 'Чары ' : 'Закл. ';
        return type + this.level;
    }

    getTraditions() {
        return this.tradition.join(', ');
    }

    getDistanceAreaTarget() {
        if (this.distanceAreaTarget === null) {
            let items = [{ 'name': 'Дистанция', 'value': this.distance },
            { 'name': 'Область', 'value': this.area },
            { 'name': 'Цели', 'value': this.target }]
                .filter(item => item.value != null)
                .map(item => '<strong>' + item.name + '</strong> ' + item.value);
            this.distanceAreaTarget = items.join('; ');
        }
        return this.distanceAreaTarget;
    }

    getSavingThrowAndDuration() {
        if (this.savingThrowAndDuration === null) {
            let items = [{ 'name': 'Спасбросок', 'value': this.saves },
            { 'name': 'Продолжительность', 'value': this.duration }]
                .filter(item => item.value != null)
                .map(item => '<strong>' + item.name + '</strong> ' + item.value);
            this.savingThrowAndDuration = items.join('; ');
        }
        return this.savingThrowAndDuration;
    }

    getCardElement() {
        return $('#' + this.id);
    }

    splitOverflowed(cardType) {
        let card = this.getCardElement();
        let content = $('.text-pf', card);
        this.overflowedCache = getOverflownElements(content);
        

        if (this.overflowedCache.length > 0) {
            this.overflowedCache.parentNode = content;
            $('.next-page-icon', card).css('visibility', 'visible');

            let rendered = renderCardBackHtml({ 'spell': this, 'content': this.overflowedCache.map((_, item) => item.outerHTML), 'cardType': cardType, 'cardTypeName': getCardHeader(cardType) });
            card.after(rendered);
            this.overflowedCache.remove();
        }
        
    }

    isOverflowed() {
        let card = this.getCardElement();
        let content = $('.content', card)[0];
        return content.scrollHeight > content.offsetHeight;
    }

    compare(anotherSpell) {
        let levelCompareResult = levelCompare(this, anotherSpell);

        if (levelCompareResult == 0) {
            return nameCompare(this, anotherSpell);
        }

        return levelCompareResult;
    }
}

function levelCompare(a, b) {
    if (a.level > b.level)
        return 1;

    if (a.level < b.level)
        return -1;

    // Если уровень одинаковый - делаем проверку на чары
    return cantripCompare(a, b);
}

function cantripCompare(a, b) {
    // Попадаем сюда тольк в случае, если уровни заклинаний совпадают
    // Если оба являются (или не являются) чарами - равнозначны
    // Если какой-то из них является чарами, то продвигаем его вперёд
    if ((a.traits.includes('чары') && b.traits.includes('чары')) || (!a.traits.includes('чары') && !b.traits.includes('чары')))
        return 0;
    else if (b.traits.includes('чары'))
        return 1;
    else
        return -1;
}

function nameCompare(a, b) {
    return a.name_ru > b.name_ru ? 1 : -1;
}

class SpellFactory {
    static create(spell) {
        let id = "spell-" + spell.name_en.toLowerCase().replace('\'', '').split(' ').join('-');
        return new Spell(id, spell);
    }
}

export { SpellFactory }