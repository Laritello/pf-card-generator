import { getOverflownElements, getCardHeader } from "./utility.js";
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
        
        let type = this.traits.includes('чары')  ? 'Чары ' : 'Закл. ';
        this.level = type + ' ' + this.level;

        this.overflowedCache = null;
    }

    getDistanceAreaTarget() {
        if(this.distanceAreaTarget === null) {
            let items = [{ 'name': 'Дистанция','value': this.distance },
                    { 'name': 'Область','value': this.area },
                    { 'name': 'Цели','value': this.target }]
                    .filter(item => item.value != null)
                    .map(item => '<strong>' + item.name + '</strong> ' + item.value);
            this.distanceAreaTarget = items.join('; ');
        }
        return this.distanceAreaTarget;
    }

    getSavingThrowAndDuration() {
        if (this.savingThrowAndDuration === null) {
            let items = [{ 'name': 'Спасбросок','value': this.saves },
                    { 'name': 'Продолжительность','value': this.duration }]
                    .filter(item => item.value != null)
                    .map(item => '<strong>' + item.name + '</strong> ' + item.value);
            this.savingThrowAndDuration = items.join('; ');
        }
        return this.savingThrowAndDuration;
    }

    getCardElement() {
        return $('#'+this.id);
    }

    splitOverflowed(cardType) {
        let card = this.getCardElement();
        if (this.overflowedCache === null) {
            let content = $('.text-pf', card);
            this.overflowedCache = getOverflownElements(content);
        }
        
        if (this.overflowedCache.length > 0) {
            let rendered = renderCardBackHtml({ 'spell': this, 'content': this.overflowedCache.map((_, item) => item.outerHTML), 'cardType': cardType, 'cardTypeName': getCardHeader(cardType) });
            card.after(rendered);
        }
        this.overflowedCache.remove();
    }

    isOverflowed() {
        let card = this.getCardElement();
        let content = $('.text-pf', card);
        this.overflowedCache = getOverflownElements(content);
        if (this.overflowedCache.length > 0) {
            return true;
        }
    }
}

class SpellFactory {
    static #cache = {}
    static create(spell) {
        let id = "spell-" + spell.name_en.toLowerCase().replace('\'', '').split(' ').join('-');
        if (id in this.#cache) {
            return this.#cache[id];
        }
        
        let result = new Spell(id, spell);
        this.#cache[id] = result;
        return result;
    }
}

export { SpellFactory }