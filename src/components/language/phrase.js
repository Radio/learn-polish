export default class Phrase {
  constructor (tokens) {
    this.tokens = tokens;
  }
  stringify () {
    return this.tokens.map(token => token.value).join(' ');
  }

  translate () {
    return new Phrase(this.tokens.map(token => token.translate()));
  }

  tokenize () {
    return this.tokens;
  }
}
