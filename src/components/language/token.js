export default class Token {
  constructor (value, translation, type, reqs) {
    this.value = value || '';
    this.translation = translation || '';
    this.type = type;
    this.reqs = reqs || {};
  }

  isOfType (type) {
    return this.type === type;
  }

  matchesReqs (reqs) {
    for (let req in this.reqs) {
      if (!this.reqs.hasOwnProperty(req) || !reqs.hasOwnProperty(req) || !reqs[req]) {
        continue;
      }

      if (this.reqs[req] !== reqs[req]) {
        return false;
      }
    }

    return true;
  }

  requires () {
    return this.reqs;
  }

  translate () {
    return new Token(this.translation, this.value, this.type, this.reqs);
  }
}
