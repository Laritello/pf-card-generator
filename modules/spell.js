import { getOverflownElements } from "./utility.js";

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
}

class SpellFactory {
    static #cache = {}
    static create(spell) {
        let id = "spell-" + spell.name_en.toLowerCase().split(' ').join('-');
        if (id in this.#cache) {
            return this.#cache[id];
        }
        
        let result = new Spell(id, spell);
        this.#cache[id] = result;
        return result;
    }
}

export { SpellFactory }