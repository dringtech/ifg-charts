import { choose, cycle, randomDateSequence } from './utils.js';

export const simpleData = [
  {
    start: '2023-01-01',
    end: '2023-01-30',
    label: 'Line 1',
    'Party affiliation': 'party-lab',
    Gender: 'gender-male'
  },
  {
    start: '2023-06-13',
    end: '2024-02-12',
    label: 'Line 2',
    'Party affiliation': 'party-con',
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

export const categories = {
  'Party affiliation': {},
  'Gender': {},
  'Ministerial rank': {}
};

export const overlay = [
  { date: '2019-11-12', label: 'General Election 2019' },
  { date: new Date('2023-04-06'), label: 'Financial Year 2023' },
  { date: '2023-11-11', label: ['Armistice', 'Day 2023'] },
  { date: '2019-03-01', label: ['First', 'elected'], colour: '#c1c5c8', persist: true },
];

export const options = {
  data: simpleData,
  data: generatedData,
  categoryColours,
  categories,
  overlay,
  title: [
    'Auto generated example chart',
    // 'two line title',
  ],
  notes: [
    'Source: Institute for Government analysis of [publisher], [dataset], [time period]',
    'Second line of notes.'
  ]
  // showControls: false,
}

export const documentationExample = {
  // title and notes will appear at the top and bottom respectively. Max two lines of each.
  title: ["First line of title", "Second line of title"],
  notes: ["First line of notes", "Second line of notes"],

  // data to enter into the timeline
  data: [
    // start, end and label are used to draw bars.
    // Additional properties can be used for category colouring
    {
      start: "2024-01-01", end: "2024-02-01", label: "First bar",
      party: "party-lab", gender: "gender-male"
    }, {
      start: "2024-02-01", end: "2024-03-01", label: "Second bar",
      party: "party-con", gender: "gender-female"
    }, {
      start: "2024-03-01", end: "2024-03-01T01:00:00", label: "Narrow Bar (min 1.5px)",
      party: "party-lab", gender: "gender-female"
    },
  ],

  startDate: "2023-12-01",
  endDate: "2024-04-30",

  // Categories keys should match names of additional properties in data above
  // an optional label can be provided for labelling.
  categories: {
    party: { label: 'Party'},
    gender: { label: 'Gender'},
  },

  // Category colour object keys should match values used in additional properties
  categoryColours: {
    "party-lab": { colour: "#ee3224", label: "Labour" },
    "party-con": { colour: "#00539f", label: "Conservative" },
    "gender-male": { colour: "#00c7b1", label: "Male" },
    "gender-female": { colour: "#84329b", label: "Female" },
  },

  // overlay defines annotation lines
  overlay: [
    // string labels will be split on whitespace to put on multiple lines
    { date: "2024-01-10", label: "Auto-split label" },
    // array labels displayed on as many lines
    { date: "2024-01-20", label: ["Line one", "line two"] },
    // colours can be set to any CSS colour
    { date: "2024-02-10", label: "Colored", colour: "#c1c5c8" },
    // persistent labels will always be shown
    { date: "2024-02-20", label: "Persistent", persist: true, colour: "#8d949a" }
  ],

  chartWidth: 1024, // Width of chart
  minHeight: 200,  // Minimum height of chart

  showControls: true,  // Whether or not to show controls on the chart
  showOverlay: true,   // Show or hide the non-persistent overlay items

  labels: {
    overlay: "Show general elections",
    category: "Colour by",
    image: 'Download as image <svg class="o-svg o-svg--download"><use class="o-svg__use" href="/sprite.symbol.svg?v=11#download"></use></svg>',
    svg: 'Download as SVG <svg class="o-svg o-svg--download"><use class="o-svg__use" href="/sprite.symbol.svg?v=11#download"></use></svg>',
  }
};