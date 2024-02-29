import { choose, cycle, randomDateSequence } from './utils.js';

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
  'party-lab': {
    colour: '#ee3224',
    label: 'Labour'
  },
  'party-con': {
    colour: '#00539f',
    label: 'Conservative'
  },
  'party-lib': {
    colour: '#ffb703',
    label: 'Lib Dem / Liberal'
  },
  'party-snp': {
    colour: '#fff95d',
    label: 'SNP'
  },
  'party-independent': {
    colour: '#c1c5c8',
    label: 'Independent/Other'
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
  },
  'rank-1': {
    colour: '#00C7B1',
    label: 'Prime minister' 
  },
  'rank-2': {
    colour: '#D0006F',
    label: 'Deputy prime minister' 
  },
  'rank-3': {
    colour: '#D0006F',
    label: 'Secretary of state' 
  },
  'rank-4': {
    colour: '#00A8E1',
    label: 'Minister of state' 
  },
  'rank-5': {
    colour: '#54D4FF',
    label: 'Parliamentary under secretary of state' 
  },
  'rank-6': {
    colour: '#BE75D2',
    label: 'Whips' 
  },
}

// SNP #fff95d
// Plaid Cymru #3f8429
// Green #6ab023
// UKIP #722889
// Brexit Party/Reform UK #3bb7ce
// DUP #8f1d20
// Sinn Fein #006837
// Alliance #f2d303
// SDLP #0e6e51
// UUP #0eaefe
// Alba #005EB8
// The Reclaim Party #14172D
// People Before Profit #d62249
// Traditional Unionist Voice #201863
// Women's Equality Party #65b89a
// SDP (current - for 80s alliance with Liberals, use Liberal colours) #d25469
// The Independents/Independent/Other #d0006f [IfG Pink]
// Independent/Other #c1c5c8  [IfG Grey]
// BNP #2e3b74
// Respect #af0004
// The Independent Group (for Change)/Change UK #333f48 [IfG Dark Grey]

const dateGen = randomDateSequence(new Date('2019-01-01'), 120)
const partyGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('party-')))
const genderGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('gender-')))
const rankGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('rank-')))

export const generatedData = Array.from(Array(10)).map((_, i) => ({
  ...(dateGen.next().value),
  label: `Item ${i + 1}`,
  Gender: genderGen.next().value,
  'Party affiliation': partyGen.next().value,
  'Ministerial rank': rankGen.next().value,
}));

export const categories = [ 'Party affiliation', 'Gender', 'Ministerial rank' ];

export const overlay = [
  { date: '2019-11-12', label: 'General Election 2019' },
  { date: new Date('2023-04-06'), label: 'Financial Year 2023' },
  { date: '2023-11-11', label: ['Armistice', 'Day 2023'] },
  { date: '2019-03-01', label: ['First', 'elected'], colour: '#c1c5c8', persist: true },
];

export const options = {
  data: generatedData,
  // categories,
  // categoryColours,
  // overlay,
  showControls: true,
}

