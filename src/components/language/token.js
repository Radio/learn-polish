export default class Token {
  constructor (value, reqs) {
    this.value = value || '';
    this.reqs = reqs || {};
  }
}
