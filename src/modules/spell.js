class Spell {
    constructor(id, spell) {
        Object.assign(this, spell);
        this.id = id;
        this.cast = spell.cast.replaceActionMacro();
        this.description = spell.description.replaceActionMacro();
        this.heightened = spell.heightened?.replaceActionMacro();
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