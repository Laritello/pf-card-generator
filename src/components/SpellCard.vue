<template>
    <div :id="spell.id" :class="cardType.value" class="card">
        <div class="header">{{ cardType.text }}</div>
        <div ref="content" class="content bg-pf">
            <div class="d-flex">
                <h1 id="nameField" class="name">{{ rusSpellName }}</h1>
                <h1 id="levelField" class="level ms-auto">
                    <template v-if="spellTraits.includes('чары')">Чары</template>
                    <template v-else>Закл.</template>
                    &nbsp;{{ spellLevel }}
                </h1>
            </div>
            <div style="background: #030200; height: 0.2mm; margin: 0 0 0.5mm 0;"></div>
            <div>
                <div class="pf-trait" v-for="trait in spellTraits" :class="{
                    'pf-trait-uncommon': trait == 'необычный',
                    'pf-trait-rare': trait == 'редкий'
                }">
                    {{ trait }}
                </div>
            </div>
            <div ref="text" class="text-pf">
                <p class="hang">
                    <strong>Обычай</strong>&nbsp;
                    <template v-for="(tradition, index) in spell.tradition">
                        <template v-if="index > 0">, </template>
                        {{ tradition }}
                    </template>
                </p>
                <p class="hang">
                    <strong>Каст</strong> <span v-html="spellCast"></span>
                </p>
                <p class="hang">
                    <template v-if="spellDistance">
                        <strong>Дистанция</strong> {{ spellDistance }}<template v-if="spellArea || spellTarget">; </template>
                    </template>
                    <template v-if="spellArea">
                        <strong>Область</strong> {{ spellArea }}<template v-if="spellTarget">; </template>
                    </template>
                    <template v-if="spellTarget">
                        <strong>Цели</strong> {{ spellTarget }}
                    </template>
                </p>
                <p class="hang">
                    <template v-if="spellSavingThrow">
                        <strong>Спасбросок</strong> {{ spellSavingThrow }}<template v-if="spellDuration">; </template>
                    </template>
                    <template v-if="spellDuration">
                        <strong>Продолжительность</strong> {{ spellDuration }}
                    </template>
                </p>
                <div style="background: #030200; height: 0.2mm; margin: 0 0 0.5mm 0;"></div>
                <template v-for="line in frontSideDescription">
                    <div v-if="line === 'line'" class="space-line"></div>
                    <br v-else-if="line === '<br>'">
                    <span v-else v-html="line"></span>
                </template>
            </div>
        </div>
        <div class="secondary">{{ engSpellName }}</div>
        <div style="position:relative;">
            <div v-if="isOverflowed" class="next-page-icon"><img src="images/next_page.png"></div>
        </div>
    </div>
    <div v-if="isOverflowed" :id="spell.id + '-1'" :class="cardType.value" class="card">
        <div class="header">{{ cardType.text }}</div>
        <div class="content bg-pf">
            <div class="text-pf">
                <template v-for="line in backSideDescription">
                    <div v-if="line === 'line'" class="space-line"></div>
                    <span v-else v-html="line"></span>
                </template>
            </div>
        </div>
        <div class="secondary" id="engNameField">{{ engSpellName }}</div>
    </div>
</template>

<script>
import { getOverflowedElements } from '../modules/utility'

export default {
    name: 'SpellCard',
    props: ['spell', 'cardType'],
    data() {
        return {
            isOverflowed: false,
            overflowPosition: -1,

            rusSpellName: this.spell.name_ru,
            engSpellName: this.spell.name_en,
            spellLevel: this.spell.level,
            spellTraits: this.spell.traits,
            spellTraditions: this.spell.tradition,
            spellCast: this.spell.cast,
            spellDistance: this.spell.distance,
            spellArea: this.spell.area,
            spellTarget: this.spell.target,
            spellSavingThrow: this.spell.saves,
            spellDuration: this.spell.duration,
            spellEntries: [
                ...this.spell.description,
                ...this.spell.heightened ? ['line'] : [],
                ...this.spell.heightened ?? []
            ]
        }
    },

    methods: {
        customRender() {
            if (this.isOverflowed) return;
            console.log('update')
            let card = this.$refs.content;
            if (card.scrollHeight > card.offsetHeight) {
                let overflowed = getOverflowedElements(card, this.$refs.text);
                this.isOverflowed = overflowed.length > 0;
                this.overflowPosition = this.spellEntries.length - overflowed.length;
            }
        }
    },

    computed: {
        frontSideDescription() {
            if (!this.isOverflowed) return this.spellEntries;
            return this.spellEntries.slice(0, this.overflowPosition);
        },

        backSideDescription() {
            if (!this.isOverflowed) return [];
            return this.spellEntries.slice(this.overflowPosition);
        }
    },

    mounted() {
        this.customRender();
    }
}
</script>