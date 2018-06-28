import Pattern from '../components/constructor/pattern';
import When from '../components/constructor/token-providers/when';
import Who from '../components/constructor/token-providers/who';
import Walking from '../components/constructor/token-providers/action/walking';

export default function (tokens) {
  let when = new When(tokens);
  let who = new Who(tokens);
  let walking = new Walking(tokens);

  // todo: add where

  return new Pattern([
    reqs => when.get(reqs),
    reqs => who.get(reqs),
    reqs => walking.get(reqs)
  ]);
}
