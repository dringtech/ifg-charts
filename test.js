import { cycle, randomDateSequence } from './utils.js';
import { categoryColours } from './dist/ifg-charts.es.js';

export { categoryColours };

const dateGen = randomDateSequence(new Date('2019-01-01'), 120)
const partyGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('party-')))
const genderGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('gender-')))
const rankGen = cycle(...Object.keys(categoryColours).filter(x => x.startsWith('rank-')))

export const generatedData = Array.from(Array(14)).map((_, i) => ({
  ...(dateGen.next().value),
  label: `Item ${i + 1}`,
  gender: genderGen.next().value,
  party: partyGen.next().value,
  'rank-equivalence': rankGen.next().value,
}));

export const categories = {
  party: {
    label: 'Party'
  },
  gender: {
    label: 'Gender'
  },
  'rank-equivalence': {
    label: 'Rank'
  }
};

export const overlay = [
  { date: '2019-11-12', label: 'General Election 2019' },
  { date: new Date('2023-04-06'), label: 'Financial Year 2023' },
  { date: '2023-11-11', label: ['Armistice', 'Day 2023'] },
  { date: '2019-03-01', label: ['First', 'elected'], colour: '#c1c5c8', persist: true },
];

export const options = {
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
  ],
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
      party: "party-labour", gender: "gender-m", rank: "rank-equivalence-parl"
    }, {
      start: "2024-02-01", end: "2024-03-01", label: "Second bar",
      party: "party-conservative", gender: "gender-f", rank: "rank-equivalence-dpm"
    }, {
      start: "2024-03-01", end: "2024-03-01T01:00:00", label: "Narrow Bar (min 1.5px)",
      party: "party-labour", gender: "gender-x", rank: "rank-equivalence-pm"
    },
  ],

  startDate: "2023-12-01",
  endDate: "2024-04-30",

  // Categories keys should match names of additional properties in data above
  // an optional label can be provided for labelling.
  categories: {
    party: { label: 'Party'},
    gender: { label: 'Gender'},
    rank: { label: 'Rank'},
  },

  // Category colour object keys should match values used in additional properties
  categoryColours,

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

  contrastClip: 160, // Contrast clip level

  showControls: true,  // Whether or not to show controls on the chart
  showOverlay: true,   // Show or hide the non-persistent overlay items

  labels: {
    overlay: "Show general elections",
    category: "Colour by",
    image: 'PNG <svg class="o-svg o-svg--download"><use class="o-svg__use" href="/sprite.symbol.svg?v=11#download"></use></svg>',
    svg: 'SVG <svg class="o-svg o-svg--download"><use class="o-svg__use" href="/sprite.symbol.svg?v=11#download"></use></svg>',
  }
};