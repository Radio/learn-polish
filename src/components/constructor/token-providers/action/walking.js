'use strict';

import sample from 'lodash/sample';

export default class When {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <action/walking> token.
   * @param {{tense: String, subject: String}} reqs
   * @returns {Object}
   */
  get (reqs) {
    const tense = reqs.tense || sample(this.tokens.tenses());
    const subject = reqs.subject || sample(this.tokens.subjects());
    const newReqs = Object.assign({ tense, subject }, reqs);
    const actions = this.tokens.get('action/walking', newReqs);

    return sample(actions);
  }
}
