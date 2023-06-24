<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-title>
                <v-img src="../assets/logo.png" height="50" width="50"></v-img>
            </v-app-bar-title>
            <v-btn icon="mdi-github" href="https://github.com/Laritello/pf-card-generator"></v-btn>
            <v-btn icon="mdi-printer" @click="print()"></v-btn>
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
                <v-icon>mdi-filter</v-icon>
            </v-app-bar-nav-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="right" temporary>
            <div style="padding: 10px 20px 0 20px">
                 <v-btn size="small" variant="plain" @click="dialog = true">
                    Пользовательский набор
                </v-btn>
            </div>
            <div style="padding: 20px 20px 0 20px">
                <v-combobox v-model="activeCardType" :items="cardTypes" item-title="text" item-value="value"
                    variant="outlined" label="Тип" class="no-print"></v-combobox>
            </div>
            <div style="padding: 0 20px 0 20px">
                <v-text-field clearable label="Название" variant="outlined" v-model="spellName" class="no-print"></v-text-field>
            </div>
            <v-card outlined elevation="0">
                <v-expansion-panels variant="accordion" class="elevation-0" multiple>
                    <v-expansion-panel title="Уровни заклинаний">
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
                            <v-text-field 
                                clearable 
                                label="Поиск" 
                                variant="outlined"
                                v-model="search">
                            </v-text-field>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                                v-model="customDeck"
                                :headers="headers"
                                :items="currentTypeSpells"
                                :search="search"
                                item-value="id" 
                                show-select>
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    size="small"
                                    class="me-2"
                                    @click="showItem(item.raw)">
                                    mdi-information
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="dialog = false">Закрыть</v-btn>
                        <v-btn @click="customDeck = []">Сбросить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <Display class="d-flex justify-center align-center h-100" 
            :items="filteredSpells" 
            :cardType="activeCardType"/>
        </v-main>
    </v-app>
</template>

<script>
import { getSpells, filterSpells } from "../modules/provider.js";
import Display from "./Display.vue";

export default {
    data() {
        return {
            search: '',
            dialog: false,
            loading: false,
            allSpells: getSpells(),
            spellName: "",
            activeCardType: { text: "Арканное", value: "arcane" },
            activeComponents: [],
            activeSpellLevels: [],

            customDeck: [],
            headers: [
            { title: 'Название', align: 'start', key: 'name_ru', },
            { title: 'Оригинальное название', key: 'name_en',},
            { title: 'Действия', key: 'actions', align: 'center', sortable: false },
            ],

            cardTypes: [
                { text: "Арканное", value: "arcane" },
                { text: "Сакральное", value: "divine" },
                { text: "Природное", value: "primal" },
                { text: "Оккультное", value: "occult" },
                { text: "Фокус", value: "focus" },
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
        showItem(item) {

        }
    },

    created() {
        this._keyListener = function(e) {
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
            if (this.customDeck != null && this.customDeck.length > 0)
                return this.allSpells.filter((spell) => this.customDeck.includes(spell.id));

            let name = this.spellName;
            let cardType = this.activeCardType.value;
            let components = this.activeComponents;
            let levels = this.activeSpellLevels;
            return this.allSpells.filter((spell) =>
                filterSpells(spell, name, cardType, components, levels)
            );
        },
        currentTypeSpells() {
            let cardType = this.activeCardType.value;
            return this.allSpells.filter((spell) =>
                filterSpells(spell, null, cardType, null, null)
            );
        }
    },

    components: { Display },
};
</script>

<style>
@import "../styles/main.css";
@import "../styles/font.css";

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
