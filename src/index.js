import Vue from 'vue';
import App from './Main.vue';

const container = document.createElement('div');
document.body.appendChild(container);

/* eslint-disable no-new */
new Vue({
  el: container,
  render: createElement => createElement(App)
});
