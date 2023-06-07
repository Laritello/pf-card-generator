# Генератор карт для Pathfinder 2E
Генератор позволяет сформировать набор карт для печати на листе A4. В работе ещё возможны сбои и ошибки.

# Структура файла с заклинаниями
Файл spells.json содержит список заклинаний. Каждое заклинание содержит следующие поля:
- name_ru - название на русском
- name_en - название на английском
- level - уровень заклинания
- traits - черты
- tradition - обычаи
- cast - время и компоненты сотворения
- distance - дистанция
- area - область
- duration - продолжительность
- target - цели
- saves - спасбросок
- deities - божества (не используется)
- source - источник (не используется)
- description - описание
- heightened - усиленя

# Использованные ресурсы
- Текст взят с <a href="http://www.pf2e-ru-translation.readthedocs.io">русскоязычной вики</a>
- Контрол <a href="https://github.com/snapappointments/bootstrap-select/blob/master/LICENSE">для множественного выбора</a>
- Шаблонизатор <a href="https://github.com/olado/doT/blob/master/LICENSE-DOT.txt">doT.js</a>