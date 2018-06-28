import Token from '../../language/token';
import sample from 'lodash/sample';

export default class Who {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <who> token.
   * @param {{gender: String}}} reqs
   * @returns {{token: String, reqs: Object}
   */
  get (reqs) {
    const whos = this.tokens.get('tokens.who');
    const gender = reqs.gender || sample(Object.keys(whos));

    return new Token(
      sample(whos[gender]),
      Object.assign({ gender }, reqs)
    );
  }
}
