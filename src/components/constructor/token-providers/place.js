'use strict';

import sample from 'lodash/sample';

export default class Place {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <time> token.
   * @param {{tense: String}} reqs
   * @returns {Object}
   */
  get (reqs) {
    const preposition = reqs.preposition || sample(this.tokens.prepositions());
    const newReqs = Object.assign({ preposition }, reqs);
    const prepositions = this.tokens.get('place', newReqs);

    return sample(prepositions);
  }
}
