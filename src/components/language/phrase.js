export default class Phrase {
  constructor (tokens) {
    this.tokens = tokens;
  }
  stringify () {
    return this.tokens.map(token => token.value).join(' ');
  }
}
