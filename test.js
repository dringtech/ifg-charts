import { choose, randomDateSequence } from './utils.js';

export const simpleData = [
  {
    start: '2023-01-01',
    end: '2023-06-12',
    label: 'Line 1',
    'Party affiliation': 'Labour',
    Gender: 'male'
  },
  {
    start: '2023-06-13',
    end: '2024-02-12',
    label: 'Line 2',
    'Party affiliation': 'Conservative',
  }
];

const dateGen = randomDateSequence(new Date('2019-01-01'))
const partyGen = choose('Conservative', 'Labour')
const genderGen = choose('male', 'female')

export const generatedData = Array.from(Array(10)).map((_, i) => ({
  ...(dateGen.next().value),
  label: `Item ${i + 1}`,
  Gender: genderGen.next().value,
  'Party affiliation': partyGen.next().value
}));

export const categories = [ 'Party affiliation', 'Gender' ];

export const overlay = [
  { date: '2019-11-12', label: 'General Election 2019' },
  { date: new Date('2023-04-06'), label: 'Financial Year 2023' },
  { date: '2023-11-11', label: ['Armistice', 'Day 2023'] },
];

