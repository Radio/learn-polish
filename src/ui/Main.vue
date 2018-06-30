<template>
  <div class="container" v-bind:style="{'background-color': backgroundColor}">
    <p class="phrase"><phrase v-bind:phrase="phrase"></phrase></p>
    <p class="translation" v-if="showTranslation"><phrase v-bind:phrase="phrase.translate()"></phrase></p>
  </div>
</template>

<script>
import Vue from 'vue';
import Phrase from './Phrase.vue';
import languageConfig from 'json-loader!../etc/lang.yaml';
import csv from '../etc/tokens.csv';
import CsvTokens from '../components/config/csv-tokens';
import createPattern from '../patterns/when-who-walking-where'

export default {
  data () {
    return {
      tokens: null,
      reqs: {
        tense: 'past'
      },
      fromLanguage: 'russian',
      toLanguage: 'polish',
      phrase: null,
      showTranslation: false,
      backgroundColor: '#fff'
    }
  },
  methods: {
    next () {
      this.recreateTokens();
      this.changeColor();
      this.showTranslation = false;
      this.phrase = createPattern(this.tokens).compile(this.reqs);
    },
    changeColor () {
      this.backgroundColor = "hsl(" + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' +
                 (85 + 10 * Math.random()) + '%)';
    },
    answer () {
      this.showTranslation = true;
    },
    asnwered () {
      return this.showTranslation;
    },
    recreateTokens () {
      this.tokens = new CsvTokens(csv, languageConfig, this.fromLanguage, this.toLanguage);
    }
  },
  created () {
    this.recreateTokens();
    this.next();
  },
  mounted () {
    const nextStep = () => {
      if (!this.asnwered()) {
        this.answer();
        return;
      }

      this.next();
    }

    window.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'ArrowRight') {
        event.preventDefault();
        nextStep();
      }
    });
    window.addEventListener('click', event => {
      event.preventDefault();
      nextStep();
    });
  },
  components: { Phrase }
};
</script>

<style lang="less">
body, window {
  padding: 0;
  margin: 0;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.phrase {
  margin: 15% auto 0;
  text-align: center;
  font-size: 3em
}
.translation {
  margin: 10% auto 0;
  text-align: center;
  font-size: 3em
}
</style>
