<template>
  <span>
    <template v-for="token in phrase.tokenize()">
      <span :key="token.value"
            v-bind:class="getTokenClasses(token)"
            v-bind:title="getTitle(token)">{{ token.value }}</span>
      <slot> </slot>
    </template>
  </span>
</template>

<script>
import Phrase from '../components/language/phrase';
import map from 'lodash/map';

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
    getTitle (token) {
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
    }
  }
};
</script>

<style lang="less">
.phrase {
  .person {
    &.subject-we-m,
    &.subject-you-m,
    &.subject-they-m {
      color: rgb(0, 0, 177);
    }
    &.subject-we-f,
    &.subject-you-f,
    &.subject-they-f {
      color: rgb(206, 54, 80);
    }
  }
}
</style>
