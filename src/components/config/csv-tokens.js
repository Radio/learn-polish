'use strict';

import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import Token from '../language/token';

export default class CsvTokens {
  /**
   * @param {Object} configDocument
   */
  constructor (rows, grammar, fromLanguage = 'russian', toLanguage = 'polish') {
    this.tokens = rows
      .filter(row => !!row[fromLanguage])
      .map(row => {
        return new Token(
          row[fromLanguage],
          row[toLanguage],
          row.type,
          pickBy(omit(row, ['russian', 'polish', 'type']))
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
}
