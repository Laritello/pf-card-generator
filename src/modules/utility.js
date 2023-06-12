function getOverflowedElements(parent, element) {
    let children = Array.from(element.children);
    let parentBottomEdge = parent.offsetHeight;

    let overflowed = children.filter(child => {
        var childBottomEdge = child.offsetTop + child.offsetHeight;
        return childBottomEdge > parentBottomEdge;
    });

    return overflowed;
}

// Получить выбранные значения в select
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }

    return result;
}

function getCardHeader(cardType) {
    let header = "";

    switch (cardType) {
        case "arcane": header = "Арканное"; break;
        case "primal": header = "Природное"; break;
        case "divine": header = "Сакральное"; break;
        case "occult": header = "Оккультное"; break;
        case "focus": header = "Фокус"; break;
    };

    return header;
}

const one_action_link = '<img src="images/1.png" class="text-img">';
const two_action_link = '<img src="images/2.png" class="text-img">';
const three_action_link = '<img src="images/3.png" class="text-img">';
const reaction_link = '<img src="images/R.png" class="text-img">';
const free_link = '<img src="images/F.png" class="text-img">';

String.prototype.replaceActionMacro = function () {
    return this
        .replace('(a)', one_action_link)
        .replace('(aa)', two_action_link)
        .replace('(aaa)', three_action_link)
        .replace('(r)', reaction_link)
        .replace('(f)', free_link);
}

Array.prototype.replaceActionMacro = function () {
    return this.map(item => item.replace('(a)', one_action_link)
        .replace('(aa)', two_action_link)
        .replace('(aaa)', three_action_link)
        .replace('(r)', reaction_link)
        .replace('(f)', free_link));
}

Array.prototype.replaceEach = function (what, to) {
    return this.map(item => item.replace(what, to));
}

Array.prototype.chunks = function (chunkSize) {
    return Array.from({ length: Math.ceil(this.length / chunkSize) }, (v, i) =>
        this.slice(i * chunkSize, i * chunkSize + chunkSize)
    );
}

export { getOverflowedElements, getSelectValues, getCardHeader };