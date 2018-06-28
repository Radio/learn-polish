import Token from '../../../language/token';
import sample from 'lodash/sample';

export default class When {
  constructor (tokens) {
    this.tokens = tokens;
  }

  get (reqs) {
    const actions = this.tokens.get('tokens.action.walking');
    const tense = reqs.tense || sample(Object.keys(actions));
    const gender = reqs.gender || sample(Object.keys(actions[reqs.tense]));

    return new Token(
      sample(actions[reqs.tense][reqs.gender]),
      Object.assign({ tense, gender }, reqs)
    );
  }
}
