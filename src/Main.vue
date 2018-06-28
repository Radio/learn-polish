<template>
  <h1>{{ phrase }}</h1>
</template>

<script>
import Vue from 'vue';
import yml from 'json-loader!yaml-loader!./etc/tokens.yaml';
import TokensConfig from './components/config/tokens';
import createPattern from './patterns/when-who-walking-where';

export default {
  data () {
    return {
      reqs: {
        tense: 'past',
        gender: 'i'
      },
      phrase: ''
    }
  },
  methods: {
    next () {
      this.phrase = createPattern(new TokensConfig(yml))
        .compile(this.reqs)
        .stringify();
    }
  },
  created () {
    this.next();
  },
  mounted () {
    window.addEventListener('keypress', event => {
      if (event.key === ' ') {
        event.preventDefault();
        this.next();
      }
    });
  }
};
</script>

<style lang="less">
</style>
