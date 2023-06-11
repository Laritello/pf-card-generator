import spells from '../assets/data/spells.json' with {type: 'json'};
import spellsPatch from '../assets/data/spells_patch.json' with {type: 'json'};

import { SpellFactory } from '../modules/spell.js';

function getSpells() {
    return Object.keys(spells).map(spellName => {
        var originalSpell = spells[spellName];
        if(spellName in spellsPatch) {
            let patch = spellsPatch[spellName];
            // Применяем патч к заклинанию
            Object.assign(originalSpell, patch);
        }
        return SpellFactory.create(originalSpell);
    }).sort((a, b) => a.compare(b));    
}

function filterSpells(spell, name, cardType, components, levels) {
    let nameChecked = nameCheck(spell, name); 
    let typeChecked = typeCheck(spell, cardType);
    let componentsChecked = componentsCheck(spell, components);
    let levelChecked = levelsCheck(spell, levels);

    return nameChecked && typeChecked && componentsChecked && levelChecked;
}

function nameCheck(spell, name) {
    if (name == null) return true;

    return spell.name_ru.toLowerCase().includes(name.toLowerCase()) || spell.name_en.toLowerCase().includes(name.toLowerCase());
}

function typeCheck(spell, type) {
    if (type == null) return true;
    if (spell.tradition == null) return false;

    switch(type) {
        case "arcane" : return spell.tradition.includes('арканный');
        case "primal" : return spell.tradition.includes('природный');
        case "divine" : return spell.tradition.includes('сакральный');
        case "occult" : return spell.tradition.includes('оккультный');
        case "focus"  : return spell.tradition.includes('фокус');
    };
}

function componentsCheck(spell, components) {
    if (components == null || components.length == 0) return true;
    if (spell.cast == null) return false;

    for (let i = 0; i < components.length; i++) {
        if (spell.cast.indexOf(components[i]) > -1) {
            return true;
        }
    }

    return false;
}

function levelsCheck(spell, levels) {
    if (levels == null || levels.length == 0) return true;
    if (spell.level == null) return false;

    if (levels.includes(0) && spell.traits != null && spell.traits.includes('чары'))
        return true;

    for (let i = 0; i < levels.length; i++) {
        if (spell.level == levels[i]) {
            if (spell.level == 1) {
                return !spell.traits.includes('чары'); // Если мы нашли заклинание у которого level 1 - убедиться, что это не чары
            }

            return true;
        }
    }
    
    return false;
}

export { getSpells, filterSpells };