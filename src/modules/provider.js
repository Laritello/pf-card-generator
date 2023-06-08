import spells from '../assets/data/spells.json' with {type: 'json'};
import spellsPatch from '../assets/data/spells_patch.json' with {type: 'json'};

import { SpellFactory } from '../modules/spell.js';

function getSpells(name, cardType, components, levels) {
    return Object.keys(spells)
    .filter(key => {
        let s = spells[key];
        let nameChecked = nameCheck(s, name); 
        let typeChecked = typeCheck(s, cardType);
        let componentsChecked = componentsCheck(s, components);
        let levelChecked = levelsCheck(s, levels);

        return nameChecked && typeChecked && componentsChecked && levelChecked;
    })
    .sort((keyA,keyB) => {
        let [a, b] = [spells[keyA], spells[keyB]]
        let levelSortResult = levelSort(a,b);

        if (levelSortResult == 0)
            return nameSort(a,b);
        
        return levelSortResult;
    }).map(spellName => {
        var originalSpell = spells[spellName];
        // Проверяем словарь патчей на наличие подходяшего патча
        if(spellName in spellsPatch) {
            let patch = spellsPatch[spellName];
            // Применяем патч к заклинанию
            Object.assign(originalSpell, patch);
        }
        return SpellFactory.create(originalSpell);
    });
}

function levelSort(a,b) {
    if (a.level > b.level)
        return 1;
    else if (a.level < b.level)
        return -1;
    
    // Если уровень одинаковый - делаем проверку на чары
    return cantripSort(a,b);
}

function cantripSort(a,b) {
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

function nameSort(a,b) {
    return a.name_ru > b.name_ru ? 1 : -1;
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

export { getSpells };