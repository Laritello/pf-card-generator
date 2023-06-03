function isOverflown(element) {
  // Получить размеры контента в пикселях
  let box = element.getBoundingClientRect();

  // Так как ширина контента всегда равна 59 мм
  // Можно получить соотношение пикселей к миллиметрам
  let pxToMm = 59.0 / box.width;

  // Переводим высоту из пикселей в миллиметры
  let height = box.height * pxToMm;

  // Проверяем выше ли максимальной высоты контент
  return height > 84.4;
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

export { isOverflown, getSelectValues };