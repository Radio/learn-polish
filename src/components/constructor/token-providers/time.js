'use strict';

import sample from 'lodash/sample';

export default class Time {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <time> token.
   * @param {{tense: String}} reqs
   * @returns {Object}
   */
  get (reqs) {
    const tense = reqs.tense || sample(this.tokens.tenses());
    const newReqs = Object.assign({ tense }, reqs);
    const whens = this.tokens.get('time', newReqs);

    return sample(whens);
  }
}
