'use strict';

import subjects from '../etc/tokens/subjects.csv';
import times from '../etc/tokens/times.csv';
import places from '../etc/tokens/places.csv';
import walking from '../etc/tokens/actions/walking.csv';

export default [
  ...subjects,
  ...times,
  ...places,
  ...walking
];
