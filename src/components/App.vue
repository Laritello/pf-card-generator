<template>
    <v-app>
        <v-app-bar>
            <div style="display: flex; align-items: center; justify-content: start; margin-left: 16px;">
                <v-img src="../assets/logo.png" height="50" width="50" style="margin-right: 16px;"></v-img>
                
                <!--Перейти на итератор, а не ручное добавление кнопок-->
                <div class="d-none d-sm-flex">
                    <v-btn text="Заклинания" :class="[this.selectedTab.value == 'spells' ? 'tab-active' : '']"
                        @click="selectTab(tabs[0])"></v-btn>
                    <v-btn text="Фокусы" :class="[this.selectedTab.value == 'focuses' ? 'tab-active' : '']"
                        @click="selectTab(tabs[1])"></v-btn>
                </div>

                <div class="d-flex d-sm-none" style="align-items: center; vertical-align: center;">
                    <v-combobox v-model="selectedTab" :items="tabs" item-title="text" variant="underlined" class="no-print"></v-combobox>
                </div>
            </div>

            <v-spacer />

            <v-btn icon="mdi-github" href="https://github.com/Laritello/pf-card-generator"></v-btn>
            <v-btn icon="mdi-printer" @click="print()"></v-btn>
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
                <v-icon>mdi-filter</v-icon>
            </v-app-bar-nav-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="right" temporary>
            <div v-if="this.selectedTab.value == 'spells'" style="padding: 10px 20px 0 20px">
                <v-btn size="small" variant="plain" @click="dialog = true">
                    Пользовательский набор
                </v-btn>
            </div>
            <div style="padding: 20px 20px 0 20px">
                <v-combobox v-if="this.selectedTab.value == 'spells'" v-model="activeSpellCardType" :items="cardTypes"
                    item-title="text" item-value="value" variant="outlined" label="Тип" class="no-print"></v-combobox>

                <v-combobox clearable v-if="this.selectedTab.value == 'focuses'" v-model="activeFocusClass" :items="focusClasses"
                    item-title="text" item-value="value" variant="outlined" label="Класс" class="no-print"></v-combobox>
            </div>
            <div style="padding: 0 20px 0 20px">
                <v-text-field clearable label="Название" variant="outlined" v-model="spellName"
                    class="no-print"></v-text-field>
            </div>
            <v-card outlined elevation="0">
                <v-expansion-panels variant="accordion" class="elevation-0" multiple>
                    <v-expansion-panel v-if="this.selectedTab.value == 'spells'" title="Уровни заклинаний">
                        <v-expansion-panel-text>
                            <v-list select-strategy="classic" v-model:selected="activeSpellLevels">
                                <v-list-item v-for="(item, idx) in spellLevels" :key="idx" :value="item.value">
                                    <template v-slot:prepend="{ isActive }">
                                        <v-list-item-action start>
                                            <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                                        </v-list-item-action>
                                    </template>
                                    <v-list-item-title v-text="item.text"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel v-if="this.selectedTab.value == 'focuses'" title="Уровни фокусов">
                        <v-expansion-panel-text>
                            <v-list select-strategy="classic" v-model:selected="activeFocusLevels">
                                <v-list-item v-for="(item, idx) in spellLevels" :key="idx" :value="item.value">
                                    <template v-slot:prepend="{ isActive }">
                                        <v-list-item-action start>
                                            <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                                        </v-list-item-action>
                                    </template>
                                    <v-list-item-title v-text="item.text"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-title>Компоненты</v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-list select-strategy="classic" v-model:selected="activeComponents">
                                <v-list-item v-for="(item, idx) in components" :key="idx" :value="item.value">
                                    <template v-slot:prepend="{ isActive }">
                                        <v-list-item-action start>
                                            <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                                        </v-list-item-action>
                                    </template>
                                    <v-list-item-title v-text="item.text"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>
        </v-navigation-drawer>
        <v-main style="min-height: 300px">
            <v-dialog v-model="dialog" width="auto">
                <v-card>
                    <v-card-title>
                        Пользовательский набор
                        <v-spacer></v-spacer>
                        <div style="padding: 20px 0 0 0">
                            <v-text-field clearable label="Поиск" variant="outlined" v-model="search">
                            </v-text-field>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table v-model="spellsCustomDeck" :headers="headers" :items="currentTypeSpells"
                            :search="search" item-value="id" show-select>
                            <template v-slot:item.actions="{ item }">
                                <v-icon size="small" class="me-2" @click="showItem(item.raw)">
                                    mdi-information
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="dialog = false">Закрыть</v-btn>
                        <v-btn @click="spellsCustomDeck = []">Сбросить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <Display class="d-flex justify-center align-center h-100" :items="filteredSpells" :cardType="activeCardType" />
        </v-main>
    </v-app>
</template>

<!--Необходимо для работы сайзинга панели табов-->
<script setup>
import { useDisplay } from 'vuetify'
useDisplay()
</script>

<script>
import { getSpells, filterSpells, filterFocuses } from "../modules/provider.js";
import Display from "./Display.vue";

export default {
    data() {
        return {
            search: '',
            selectedTab: { text: "Заклинания", value: "spells" },
            dialog: false,
            loading: false,
            allSpells: getSpells(),
            spellName: "",
            activeSpellCardType: { text: "Арканное", value: "arcane" },
            activeComponents: [],
            activeSpellLevels: [],
            activeFocusLevels: [],
            activeFocusClass: [],

            spellsCustomDeck: [],
            focusesCustomDeck: [],

            tabs: [
                { text: "Заклинания", value: "spells" },
                { text: "Фокусы", value: "focuses" },
            ],

            headers: [
                { title: 'Название', align: 'start', key: 'name_ru', },
                { title: 'Оригинальное название', key: 'name_en', },
                { title: 'Действия', key: 'actions', align: 'center', sortable: false },
            ],

            cardTypes: [
                { text: "Арканное", value: "arcane" },
                { text: "Сакральное", value: "divine" },
                { text: "Природное", value: "primal" },
                { text: "Оккультное", value: "occult" },
            ],

            focusClasses: [
                { text: "Ассасин Красного Богомола", value: "red-mantis-assassin" },
                { text: "Бард", value: "bard" },
                { text: "Ведьма", value: "witch" },
                { text: "Волшебник", value: "wizard" },
                { text: "Джалмерэйский Искатель Небес", value: "jalmeri-heavenseeker" },
                { text: "Друид", value: "druid" },
                { text: "Жрец", value: "cleric" },
                { text: "Маг времени", value: "time-mage" },
                { text: "Магический воин", value: "magic-warrior" },
                { text: "Магус", value: "magus" },
                { text: "Мастер заклинаний", value: "spellmaster" },
                { text: "Мастер свитков", value: "scrollmaster" },
                { text: "Монах", value: "monk" },
                { text: "Оракул", value: "oracle" },
                { text: "Повелитель зверей", value: "beastmaster" },
                { text: "Призыватель", value: "summoner" },
                { text: "Реаниматор", value: "reanimator" },
                { text: "Рейнджер", value: "ranger" },
                { text: "Рунные заклинания", value: "runelord-rune-spell" },
                { text: "Рыцари Ластволла", value: "knights-of-lastwall" },
                { text: "Святой некромант", value: "hallowed-necromancer" },
                { text: "Сновидец", value: "sleepwalker" },
                { text: "Танцор теней", value: "shadowdancer" },
                { text: "Теневой заклинатель", value: "shadowcaster" },
                { text: "Ученик Совершенства", value: "student-of-perfection" },
                { text: "Чародей", value: "sorcerer" },
                { text: "Чемпион", value: "champion" },
                { text: "Экстрасенс", value: "psychic" },
                { text: "Элементализм", value: "elementalism" },
            ],

            components: [
                { text: "Жестовый", value: "жестовый", },
                { text: "Словесный", value: "словесный", },
                { text: "Материальный", value: "материальный", },
            ],

            spellLevels: [
                { text: "Чары", value: 0 },
                { text: "Уровень 1", value: 1 },
                { text: "Уровень 2", value: 2 },
                { text: "Уровень 3", value: 3 },
                { text: "Уровень 4", value: 4 },
                { text: "Уровень 5", value: 5 },
                { text: "Уровень 6", value: 6 },
                { text: "Уровень 7", value: 7 },
                { text: "Уровень 8", value: 8 },
                { text: "Уровень 9", value: 9 },
                { text: "Уровень 10", value: 10 },
            ],

            drawer: null,
        };
    },
    methods: {
        print() {
            $(".card:nth-child(9n+9)").addClass('page-break');
            window.print();
        },
        selectTab(tab) {
            this.selectedTab = tab;
        },
        getFilteredSpells() {
            if (this.spellsCustomDeck != null && this.spellsCustomDeck.length > 0)
                return this.allSpells.filter((spell) => this.spellsCustomDeck.includes(spell.id));

            let name = this.spellName;
            let cardType = this.activeSpellCardType.value;
            let components = this.activeComponents;
            let levels = this.activeSpellLevels;
            return this.allSpells.filter((spell) =>
                filterSpells(spell, name, cardType, components, levels)
            );
        },
        getFilteredFocuses() {
            if (this.focusesCustomDeck != null && this.focusesCustomDeck.length > 0)
                return this.allSpells.filter((spell) => this.focusesCustomDeck.includes(spell.id));

            let name = this.spellName;
            let cardType = 'focus';
            let components = this.activeComponents;
            let levels = this.activeFocusLevels;
            let classes = this.activeFocusClass?.value;

            return this.allSpells.filter((spell) =>
                filterFocuses(spell, name, cardType, components, levels, classes)
            );
        }
    },

    created() {
        this._keyListener = function (e) {
            if (e.key === "p" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.print();
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },

    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    },

    computed: {
        filteredSpells() {
            switch (this.selectedTab.value) {
                case 'spells':
                    return this.getFilteredSpells();
                case 'focuses':
                    return this.getFilteredFocuses();
            }
        },
        currentTypeSpells() {
            let cardType = this.activeSpellCardType.value;
            return this.allSpells.filter((spell) =>
                filterSpells(spell, null, cardType, null, null)
            );
        },
        activeCardType() {
            switch (this.selectedTab.value) {
                case 'spells':
                    return this.activeSpellCardType;
                case 'focuses':
                    return { text: "Фокус", value: "focus" };
            }
        }
    },

    components: { Display },
};
</script>

<style>
@import "../styles/main.css";
@import "../styles/font.css";

.tab-active {
    color: black;
    font-weight: 700;
    background-color: #00000033;
}

#collection {
    display: flex;
    flex-wrap: wrap;
    font-size: 2.5mm;
}
</style>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text) .v-expansion-panel-text__wrapper {
    padding: 0 !important;
}
</style>
