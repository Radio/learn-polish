import Pattern from '../components/constructor/pattern';
import Time from '../components/constructor/token-providers/time';
import Person from '../components/constructor/token-providers/person';
import Walking from '../components/constructor/token-providers/action/walking';
import Place from '../components/constructor/token-providers/place';

export default function (tokens) {
  const time = new Time(tokens);
  const person = new Person(tokens);
  const walking = new Walking(tokens);
  const place = new Place(tokens);

  // todo: add where

  return new Pattern([
    reqs => time.get(reqs),
    reqs => person.get(reqs),
    reqs => walking.get(reqs),
    reqs => place.get(reqs)
  ]);
}
