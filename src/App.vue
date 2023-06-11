<template>
  <v-app>
      <v-app-bar>
        <v-app-bar-title>
          <v-img src="./assets/logo.png" height="50" width="50"></v-img>
        </v-app-bar-title>
        <v-btn icon="mdi-github" href="https://github.com/Laritello/pf-card-generator"></v-btn>
        <v-btn icon="mdi-printer" @click="print()"></v-btn>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
          <v-icon>mdi-filter</v-icon>
        </v-app-bar-nav-icon>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="right" temporary>
        <div style="padding: 20px 20px 0 20px">
          <v-combobox 
            v-model="activeCardType"
            :items="cardTypes"
            item-title="text"
            item-value="value"
            variant="outlined"
            label="Тип"
            @update:model-value="show()"
          ></v-combobox>
        </div>
        <div style="padding: 0 20px 0 20px" @keydown="debounce(show, 500)">
          <v-text-field clearable label="Название" variant="outlined" v-model="spellName"></v-text-field>
        </div>
        <v-card outlined elevation="0">
          <v-expansion-panels  variant="accordion" class="elevation-0" multiple>
            <v-expansion-panel title="Уровни заклинаний">
                <v-expansion-panel-text>
                  <v-list select-strategy="classic" @update:selected="show()">
                    <v-list-item v-for="(item,idx) in spellLevels" 
                          @click="toggleActive(item.value)" 
                          :key="idx"
                          :value="item.value">
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
                  <v-list select-strategy="classic" @update:selected="show()">
                    <v-list-item v-for="(item,idx) in components" 
                          @click="toggleActiveComponent(item.value)" 
                          :key="idx"
                          :value="item.value">
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

      <v-main style="min-height: 300px;">
        <Display 
          class="d-flex justify-center align-center h-100"
          :items="displayedSpells"
          :cardType="activeCardType"
          :loading="loading">
        </Display>
      </v-main>
    </v-app>
</template>


<script>
  import { createDebounce } from './modules/utility';
  import { getSpells } from './modules/provider.js';
  import Display from './components/Display.vue';


  export default {
    data() {
        return {
            loading: false,
            displayedSpells: null,
            spellName: null,
            cardType: "arcane",
            activeCardType: { text: "Арканное", value: "arcane" },
            cardTypes: [
                { text: "Арканное", value: "arcane" },
                { text: "Сакральное", value: "divine" },
                { text: "Природное", value: "primal" },
                { text: "Оккультное", value: "occult" },
                { text: "Фокус", value: "focus" },
            ],
            components: [
                {
                    text: "Жестовый",
                    value: "жестовый"
                },
                {
                    text: "Словесный",
                    value: "словесный"
                },
                {
                    text: "Материальный",
                    value: "материальный"
                }
            ],
            activeComponents: [],
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
            activeSpellLevels: [],
            drawer: null,
        };
    },
    methods: {
        toggleActive(idx) {
            let pos = this.activeSpellLevels.indexOf(idx);
            pos === -1 ? this.activeSpellLevels.push(idx) : this.activeSpellLevels.splice(pos, 1);
        },
        toggleActiveComponent(idx) {
            let pos = this.activeComponents.indexOf(idx);
            pos === -1 ? this.activeComponents.push(idx) : this.activeComponents.splice(pos, 1);
        },
        getFilteredSpells() {
            let name = this.spellName;
            let cardType = this.activeCardType.value;
            let components = this.activeComponents;
            let levels = this.activeSpellLevels;
            return getSpells(name, cardType, components, levels);
        },
        initializePage(parent) {
            let page = document.createElement("div");
            page.classList.add("printable-page");
            parent.append(page);
            return page;
        },
        show() {
            this.displayedSpells = this.getFilteredSpells();
        },
        print() {
          window.print();
        },
        
        debounce: createDebounce()
    },
    mounted(){
        this.show()
    },
    components: { Display }
}
</script>

<style>
  @import "./styles/main.css";
  @import "./styles/card.css";
  @import "./styles/font.css";

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