<template>
  <div class="container" v-bind:style="{'background-color': backgroundColor}">
    <p class="phrase"><phrase v-bind:phrase="phrase"></phrase></p>
    <p class="translation" v-if="showTranslation"><phrase v-bind:phrase="phrase.translate()"></phrase></p>
  </div>
</template>

<script>
import Phrase from './Phrase.vue';
import languageConfig from '../etc/lang.yaml';
import csv from '../etc/tokens.csv';
import CsvTokens from '../components/config/csv-tokens';
import createPattern from '../patterns/when-who-walking-where';
import Synthesis from '../components/speech/synthesis';

let synth = new Synthesis();

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
    };
  },
  created () {
    this.recreateTokens();
    this.next();
  },
  methods: {
    next () {
      this.changeColor();
      this.showTranslation = false;
      this.phrase = createPattern(this.tokens).compile(this.reqs);
    },
    changeColor () {
      // generate some pastel color
      this.backgroundColor = 'hsl(' + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' +
                 (85 + 10 * Math.random()) + '%)';
    },
    answer () {
      this.showTranslation = true;
    },
    speak () {
      synth.sayInPolish(this.phrase.translate().stringify());
    },
    asnwered () {
      return this.showTranslation;
    },
    recreateTokens () {
      this.tokens = new CsvTokens(csv, languageConfig, this.fromLanguage, this.toLanguage);
    }
  },
  mounted () {
    const nextStep = () => {
      if (!this.asnwered()) {
        this.answer();
        this.speak();
        return;
      }

      this.next();
    };

    window.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'ArrowRight') {
        event.preventDefault();
        nextStep();
      }
    });
    window.addEventListener('click', () => nextStep());

    let touchMoved = false;
    let touchStartedAt = false;
    window.addEventListener('touchstart', () => {
      touchMoved = false;
      touchStartedAt = Date.now();
    });
    window.addEventListener('touchmove', () => {
      touchMoved = true;
    });
    window.addEventListener('touchend', () => {
      if (!touchMoved && Date.now() - touchStartedAt < 400) {
        nextStep();
      }
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
.phrase,
.translation {
  position: relative;
  margin: 0 1em;
  text-align: center;
  font-size: 3em
}

@media screen and (orientation:portrait) {
  .phrase {
    top: 15%;
    font-size: 6em;
  }
  .translation {
    top: 30%;
    font-size: 6em;
  }
}
@media screen and (orientation:landscape) {
  .phrase {
    top: 25%;
  }
  .translation {
    top: 45%;
  }
}
</style>
