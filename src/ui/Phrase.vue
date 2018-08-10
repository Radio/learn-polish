<template>
  <span v-bind:class="getPhraseClasses(phrase)">
    <template v-for="token in phrase.tokenize()">
      <span :key="token.value"
            v-bind:class="getTokenClasses(token)"
            v-bind:title="getTokenTitle(token)">{{ token.value }}</span>
      <slot> </slot>
    </template>
  </span>
</template>

<script>
import Phrase from '../components/language/phrase';
import map from 'lodash/map';
import merge from 'lodash/merge';

export default {
  props: {
    phrase: Phrase
  },
  methods: {
    getTokenClasses (token) {
      return [
        token.type.replace('/', '-'),
        ...map(token.requires(), (value, req) => req + '-' + value.replace('/', '-'))
      ];
    },
    getTokenTitle (token) {
      if (!token.isOfType('person')) {
        return null;
      }

      const subject = token.requires().subject;
      if (['we/m', 'you/m', 'they/m'].indexOf(subject) >= 0) {
        return 'Mięskoosobowy';
      }
      if (['we/f', 'you/f', 'they/f'].indexOf(subject) >= 0) {
        return 'Nie mięskoosobowy';
      }

      return null;
    },
    getPhraseClasses (phrase) {
      return map(
        phrase.tokenize().reduce((phraseReqs, token) => merge(phraseReqs, token.requires()), {}),
        (value, req) => req + '-' + value.replace('/', '-')
      );
    }
  }
};
</script>

<style lang="less">
.phrase {
  .tense-past {
    .person {
      &.subject-we-m,
      &.subject-you-m,
      &.subject-they-m {
        color: #004381;
        position: relative;

        &:before,
        &:after {
          content: "";
          background: transparent url(Phrase/men.svg) no-repeat center top;
          background-size: contain;
          position: absolute;
          width: 10px;
          height: 20px;
          top: -5px;
        }
        &:before {
          right: 50%;
        }
        &:after {
          left: 50%;
        }
      }
      &.subject-we-f,
      &.subject-you-f,
      &.subject-they-f {
        color: #a10532;
        position: relative;

        &:before,
        &:after {
          content: "";
          background: transparent url(Phrase/women.svg) no-repeat center top;
          background-size: contain;
          position: absolute;
          width: 10px;
          height: 20px;
          top: -5px;
        }
        &:before {
          right: 50%;
        }
        &:after {
          left: 50%;
        }
      }

      @media screen and (orientation:portrait) {
        &.subject-we-m,
        &.subject-you-m,
        &.subject-they-m,
        &.subject-we-f,
        &.subject-you-f,
        &.subject-they-f {
          &:before,
          &:after {
            width: 20px;
            height: 40px;
          }
        }
      }
    }
  }
}
</style>
