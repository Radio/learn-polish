'use strict';

import sample from 'lodash/sample';

export default class Person {
  constructor (tokens) {
    this.tokens = tokens;
  }

  /**
   * Get random <person> token.
   * @param {{subject: String}} reqs
   * @returns {Object}
   */
  get (reqs) {
    const subject = reqs.subject || sample(this.tokens.subjects());
    const newReqs = Object.assign({ subject }, reqs);
    const whos = this.tokens.get('person', newReqs);

    return sample(whos);
  }
}
