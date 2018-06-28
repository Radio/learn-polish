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
    const tokens = this.tokenProviders.reduce((tokens, provide) => {
      tokens.unshift(provide(tokens[0] ? tokens[0].reqs : reqs));
      return tokens;
    }, []);

    return new Phrase(tokens.reverse());
  }
}
