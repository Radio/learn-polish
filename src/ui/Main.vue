<template>
  <div class="container" v-bind:style="{'background-color': backgroundColor}">
    <p class="phrase"><phrase v-bind:phrase="phrase"></phrase></p>
    <p class="translation" v-if="showTranslation"><phrase v-bind:phrase="phrase.translate()"></phrase></p>
    <div class="actions">
      <div href="#" class="action speaker-switch"
        v-bind:class="{'on': !silent, 'off': silent}"
        v-on:click.prevent.stop="silent = !silent">{{ silent ? 'включить звук' : 'выключить звук' }}</div>
    </div>
  </div>
</template>

<script>
import Phrase from './Phrase.vue';
import tokens from '../etc/tokens-from-google-sheets'; // '../etc/tokens-from-local-csvs'
import grammar from '../etc/grammar.yaml';
import Dictionary from '../components/language/dictionary';
import createPattern from '../patterns/when-who-walking-where';
import Synthesis from '../components/speech/synthesis';

let synth = new Synthesis();

export default {
  data () {
    return {
      dictionary: null,
      reqs: {
        tense: 'past'
      },
      fromLanguage: 'russian',
      toLanguage: 'polish',
      phrase: null,
      showTranslation: false,
      backgroundColor: '#fff',
      silent: false
    };
  },
  created () {
    this.recreateDictionary();
    this.next();
  },
  methods: {
    next () {
      this.changeColor();
      this.showTranslation = false;
      this.phrase = createPattern(this.dictionary).compile(this.reqs);
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
    maySpeak () {
      return !this.silent;
    },
    asnwered () {
      return this.showTranslation;
    },
    recreateDictionary () {
      this.dictionary = new Dictionary(tokens, grammar, this.fromLanguage, this.toLanguage);
    }
  },
  mounted () {
    const nextStep = () => {
      if (this.asnwered()) {
        return this.next();
      }

      this.answer();

      if (this.maySpeak()) {
        this.speak();
      }
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
    window.addEventListener('touchend', (event) => {
      if (event.target.className.indexOf('action') >= 0) {
        return;
      }
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

.actions {
  position: absolute;
  bottom: 0;
  width: 100%;

  .action {
    cursor: pointer;
    text-decoration: underline;
    display: block;
    padding: 1em 1.2em;
    box-sizing: border-box;
    float: right;
    font-size: 1.3em;
  }
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
  .actions {
    .action {
      font-size: 3em;
    }
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
