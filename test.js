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

export const categoryColours = {
  'Labour': {
    colour: 'red'
  },
  'Conservative': {
    colour: 'blue'
  },
  'gender-male': {
    colour: '#00c7b1',
    label: 'Male'
  },
  'gender-female': {
    colour: '#84329b',
    label: 'Female'
  },
  'gender-other': {
    colour: '#ED8B00',
    label: 'Other'
  }
}

const dateGen = randomDateSequence(new Date('2019-01-01'))
const partyGen = choose('Conservative', 'Labour')
const genderGen = choose('gender-male', 'gender-female', 'gender-other')

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

