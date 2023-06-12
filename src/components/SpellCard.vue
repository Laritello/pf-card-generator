<template>
    <div :id="spell.id" :class="cardType.value" class="card">
        <div class="header">{{cardType.text}}</div>
        <div ref="content" class="content bg-pf">
            <div class="d-flex">
                <h1 id="nameField" class="name">{{spell.name_ru}}</h1>
                <h1 id="levelField" class="level ms-auto">{{spell.getLevel()}}</h1>
            </div>
            <div style="background: #030200; height: 0.2mm; margin: 0 0 0.5mm 0;"></div>
            <div>
                <div class="pf-trait" v-for="trait in spell.traits">{{trait}}</div>
            </div>
            <div ref="text" class="text-pf">
                <p class="hang" v-html="spell.getTraditions()"></p>
                <p class="hang" v-html="spell.getCast()"></p>
                <p class="hang" v-html="spell.getDistanceAreaTarget()"></p>
                <p class="hang" v-html="spell.getSavingThrowAndDuration()"></p>
                <div style="background: #030200; height: 0.2mm; margin: 0 0 0.5mm 0;"></div>
                <p v-for="line in frontSideDescription" v-html="line"></p>
            </div>
        </div>
        <div class="secondary" id="engNameField">{{spell.name_en}}</div>
        <div style="position:relative;">
            <div class="next-page-icon" style="visibility:hidden"><img src="images/next_page.png"></div>
        </div>
    </div>
    <div v-if="isOverflowed" :id="spell.id+'-1'" :class="cardType.value" class="card">
        <div class="header">{{cardType.text}}</div>
        <div class="content bg-pf">
            <div class="text-pf">
                <p v-for="line in backSideDescription" v-html="line"></p>
            </div>
        </div>
        <div class="secondary" id="engNameField">{{spell.name_en}}</div>
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
            description: [
                ...this.spell.description, 
                ...this.spell.heightened ? ['<div style="background: #030200; height: 0.2mm; margin: 0 0 0.5mm 0;"></div>'] : [],
                ...this.spell.heightened ?? []
            ]

        }
    },
    methods: {
        customRender() {
            if(this.isOverflowed) return;

            let card = this.$refs.content;
            if(card.scrollHeight > card.offsetHeight) {
                let overflowed = getOverflowedElements(card, this.$refs.text);

                this.isOverflowed = overflowed.length > 0;
                this.overflowPosition = this.description.length - overflowed.length;
            }
        }
    },
    computed: {
        frontSideDescription() {
            if(!this.isOverflowed) return this.description;
            return this.description.slice(0, this.overflowPosition);
        },

        backSideDescription() {
            if(!this.isOverflowed) return [];
            return this.description.slice(this.overflowPosition);
        }
    },

    mounted() {
        this.customRender();
    },

    updated() {
        this.customRender();
    }
}
</script>