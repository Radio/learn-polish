'use strict';

import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import Token from '../language/token';

const knownLanguages = ['russian', 'polish'];

export default class Dictionary {
  constructor (tokens, grammar, fromLanguage = 'russian', toLanguage = 'polish') {
    this.tokens = tokens
      .filter(row => !!row[fromLanguage])
      .map(row => {
        return new Token(
          row[fromLanguage],
          row[toLanguage],
          row.type,
          pickBy(omit(row, ['type', ...knownLanguages]))
        );
      });
    this.grammar = grammar;
  }

  get (type, reqs) {
    return this.tokens.filter(token => token.isOfType(type) && token.matchesReqs(reqs));
  }

  subjects () {
    return this.grammar.subjects;
  }

  tenses () {
    return this.grammar.tenses;
  }

  prepositions () {
    return this.grammar.prepositions;
  }

  aspects () {
    return this.grammar.aspects;
  }
}
