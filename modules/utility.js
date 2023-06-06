function getOverflownElements(element) {
  let parent = $(element).parent();
  let children = $(element).children();
  let parentHeight = parent.outerHeight(false);
  let overflown = children.filter((i, c) => {
    let child = $(c);
    let position = child.position();
    var bottom = position.top + child.outerHeight(true); // true = +margin

    return bottom > parentHeight;
  });

  return overflown;
}

// Получить выбранные значения в select
function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (let i = 0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }

  return result;
}

export { getOverflownElements, getSelectValues };