<template>
    <v-container fill-height full-width fluid>
        <v-row>
            <v-col justify-center>
                <div style="text-align: center;" v-if="loading">
                    <v-progress-circular model-value="20" :size="128" :width="8" indeterminate></v-progress-circular>
                </div>
                <div id="card-container" class="justify-center align-center collection"></div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { getCardHeader } from '../modules/utility';
    
    let template = $('#card_collection_template').html();
    let renderCardHtml = doT.template(template, undefined, undefined);

    export default {
        name: 'Display',
        props: ['items', 'cardType', 'loading'],

        updated() {
            let cardType = this.cardType.value;
            let spells = this.items;
            let rendered = renderCardHtml({ "spells": spells, "cardType": cardType, "cardTypeName": getCardHeader(cardType) });
            $("#card-container").html(rendered);
            setTimeout(() => {
                let overflowed = spells.filter(spell => spell.isOverflowed());
                overflowed.forEach(spell => spell.splitOverflowed(cardType));
                $(".card:nth-child(9n+9)").addClass('page-break');
            }, 1000);
        }
    }
</script>

<style>
    :root{
        --arcane-light:#7b1216;
        --arcane-base:#8b0e16;
        --arcane-dark:#2e0000;
        --divine-light:#3e4093;
        --divine-base:#162b62;
        --divine-dark:#1c1b3a;
        --primal-light:#4f7440;
        --primal-base:#1e6a39;
        --primal-dark:#283120;
        --occult-light:#646464;
        --occult-base:#000000;
        --occult-dark:#1e1a1b;
        --focus-light:#a75e33;
        --focus-base:#98521e;
        --focus-dark:#55321c;
        --border-color:#d3ca8a;

        --table-header-color:#500000;
        --table-odd-background:#eae3c7;
    }

    .collection {
        display: flex;
        flex-wrap: wrap;
    }
    .arcane {
        --light-color:var(--arcane-light);
        --base-color:var(--arcane-base);
        --dark-color:var(--arcane-dark);
    }

    .divine {
        --light-color:var(--divine-light);
        --base-color:var(--divine-base);
        --dark-color:var(--divine-dark);
    }

    .primal {
        --light-color:var(--primal-light);
        --base-color:var(--primal-base);
        --dark-color:var(--primal-dark);
    }

    .occult {
        --light-color:var(--occult-light);
        --base-color:var(--occult-base);
        --dark-color:var(--occult-dark);
    }

    .focus {
        --light-color:var(--focus-light);
        --base-color:var(--focus-base);
        --dark-color:var(--focus-dark);
    }


    .card {
        width: 63.5mm;
        height: 88.9mm;

        margin: 0.5mm;
        font-size: 2.05mm;
        
        display: flex;
        background: linear-gradient(180deg, var(--light-color) 0%, var(--dark-color) 100%);
        align-content: center;
        border-radius: 0;
        border-width: 0;
        border-color: transparent;
    }

    .card h1,
    .card h2,
    .card h3,
    .card h4,
    .card h5,
    .card h6 {
        margin: 0;
        font-family: 'ff-good-web-pro-condensed', sans-serif;
        padding: 0;
        line-height: 1;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 2.05mm;
    }

    .card h1 {
        font-size: 3.5875mm; /*font-size: 1.75rem;*/
    }

    .card h2 {
        font-size: 2.5625mm; /*font-size: 1.25rem;*/
    }

    .card h3 {
        font-size: 2.46mm; /*font-size: 1.2rem;*/
    }

    .card h4 {
        font-size: 2.3575mm; /*font-size: 1.15rem;*/
    }

    .card h5 {
        font-size: 2.255mm; /*font-size: 1.1rem;*/
    }

    .card h6 {
        font-size: 2.1525mm; /*font-size: 1.05rem;*/
    }

    .card .content {
        margin-top: 1.5mm;
        margin-left: 2.25mm;
        margin-right: 2.25mm;
        margin-bottom: 2mm;
        background-color: white;
        position: absolute;
        width: 59mm;
        height: 84.4mm;
        border-color: var(--border-color);
        border-radius: 3mm;
        border-width: 0.5mm;
        border-style: solid;
        padding: 1mm;
        overflow:hidden;
    }

    .card .content .name {
        flex-shrink: 1;
    }

    .card .content .level {
        white-space: nowrap;
    }

    .card .header {
        background: var(--base-color);
        z-index: 1;

        position:relative;
        margin:0 auto;
        padding: 0.1mm 2mm 0.0mm 2mm;    
        align-self: flex-start;

        font-size: 1.64mm; /* 0.8rem */
        font-family: 'ff-good-web-pro', sans-serif;
        font-weight: 700;
        color: white;

        border-radius: 0mm 0mm 1.5mm 1.5mm;
    }

    .card .secondary {
        z-index: 1;

        position: absolute;
        padding-bottom: 0;

        margin: 86.3mm 0 0 5mm; 
        align-self: flex-start;
        
        font-size: 1.64mm; /* 0.8rem */
        font-family: 'ff-good-web-pro', sans-serif;
        font-weight: 400;
        color: white;
    }

    .card .next-page-icon {
        z-index: 1;

        position: absolute;
        bottom: -3.5mm;
        right: -3.5mm;

        display: inline-block;
        align-self: flex-end;

        height: 10mm;
        width: 10mm;

        background-color: var(--base-color);

        border: solid var(--border-color);
        border-width: 0.7mm;
        border-radius: 5mm;

        clip-path: inset(0mm 3.5mm 3.5mm 0mm);
    }

    .card .next-page-icon img {
        position: absolute;
        top: 2mm;
        left: 2mm;

        height: 3mm;
        width: 3mm;
    }

    /* Traits */
    .pf-trait {
        display: inline-block;
        font-family: 'ff-good-web-pro-condensed', sans-serif;
        font-size:  1.845mm; /* 0.9rem */
        line-height: 1;
        text-transform: uppercase;
        background: #5d0000;
        padding-left: 1.025mm !important; /* 0.5rem */
        padding-right: 1.025mm;  /* 0.5rem */
        padding-top: 0.82mm;  /* 0.4rem */
        padding-bottom: 0.5125mm;  /* 0.25rem */
        color: #fff;
        /* text-shadow: 0 0 0 #fff; */
        font-weight: bold;
        margin: 0 0 0.4mm 0;
        border: 2px solid #d8c384;
        min-width: 10.25mm; /* 5rem */
        text-align: center;
        letter-spacing: 0.1025mm; /* 0.05rem */
    }

    .pf-trait-edge {
        padding: 0.82mm 0 0.5125mm 0 !important; /* 0.4rem 0 0.25rem 0 */
        width: 3px;
        min-width: 0;
        overflow: hidden;
        vertical-align: top;
        background-color: #d8c384;
    }

    .pf-traits {
        line-height: 1;
        display: inline-block;
        background: #d8c384;
        margin: 0;
        /* padding: 0 0.125rem; */
    }

    .pf-trait-size {
        background: #3a7a58;
        min-width: auto;
    }

    .pf-trait-type {
        background: #004316;
        min-width: auto;
    }

    .pf-trait-align {
        background: #566193;
        min-width: auto;
    }

    .pf-trait-rare {
        background: #002564;
        min-width: auto;

    }

    .pf-trait-uncommon {
        background: #98503c;
        min-width: auto;
    }

    .pf-trait-unique {
        background: #54166d;
        min-width: auto;
    }

    /* Text */
    .bg-pf {
        background-color: #f3f2ee;
    }

    .text-pf {
        line-height: 110%;
        text-align: justify;
        font-size: 2.255mm; /* 1.1rem */
        font-family: 'ff-good-web-pro', sans-serif;
    }

    .text-pf p {
        margin: 0;
    }

    .text-pf ul {
        list-style-type: disc;
        padding-left: 5mm;
        margin: 0; /* Убирает нижний отступ */ 
    }

    .text-pf ul li {
        padding: 0;
        margin: 0;
    }

    .text-pf ol {
        list-style-type: none;
        padding-left: 5mm;
        margin: 0; /* Убирает нижний отступ */ 
    }

    .text-pf table th{
        color: white;
        background:var(--table-header-color);
        padding: 0.2mm;
    }

    .text-pf table p{
        display: table-cell;
        vertical-align: middle;
        padding: 0.8mm 0.2mm 0.2mm 0.2mm;
    }

    .text-pf table tbody tr:nth-child(odd) {
        background-color: var(--table-odd-background);
    }

    .hang {
        line-height: 140%;
        padding-left: 1em;
        margin-bottom: 0;
        text-indent: -1em;
    }

    .text-img {
        height: 1em;
        vertical-align: baseline;
        width: auto;
        transform: translateY(0.25em);
    }

    .heighten {
        margin-top: 0mm;
        margin-bottom: 2pt;
        padding-bottom: 0;
        padding-top: 0;
    }
</style>