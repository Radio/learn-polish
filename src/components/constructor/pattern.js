'use strict';

import merge from 'lodash/merge';
import Phrase from '../language/phrase';

export default class Pattern {
  constructor (tokenProviders) {
    this.tokenProviders = tokenProviders;
  }

  /**
   * Generate random phrase following given requirements.
   *
   * @param {Pattern} pattern
   * @param {Object} reqs
   * @returns {Phrase}
   */
  compile (reqs) {
    let phraseReqs = Object.assign({}, reqs);
    let tokens = this.tokenProviders.reduce((tokens, provide) => {
      if (tokens[0]) {
        merge(phraseReqs, tokens[0].requires());
      }
      const token = provide(phraseReqs);
      if (token) {
        tokens.unshift(token);
      }

      return tokens;
    }, []);

    return new Phrase(tokens.reverse());
  }
}
