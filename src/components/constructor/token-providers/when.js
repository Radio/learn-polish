import Token from '../../language/token';
import sample from 'lodash/sample';

export default class When {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <when> token.
   * @param {{tense: String}} reqs
   * @returns {{token: String, reqs: Object}
   */
  get (reqs) {
    const whens = this.tokens.get('tokens.when');
    const tense = reqs.tense || sample(Object.keys(whens));

    return new Token(
      sample(whens[reqs.tense]),
      Object.assign({ tense }, reqs)
    );
  }
}
