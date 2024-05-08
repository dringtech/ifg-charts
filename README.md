# IfG Timeline visualisation

This is a Svelte component which builds a timeline chart based on provided data

## Using the component 

```html
    <div id="timeline-chart"></div>
    <script type="module">
      import { timeline } from '/src/charts.js';

      const options = {
        data: [{
          start: '2021-01-01', end: '2022-01-02',
          label: 'An item',
          'Category A': 'value A'
          'Category B': 'value B'
        }],
        ...
      }

      timeline("timeline-chart", options);
    </script>
```

Expected options format (in sort of TypeScript format...):

```typescript
{
  /** Data to be visualised. */
  data: [
    {
      start: Date, end: Date,
      label: string,
      [category]: string
    },
    ...
  ],
  /** Title for chart */
  title: string[],
  /** Notes for chart */
  notes: string[],
  /** List of categories */
  categories: {
    [category: string]: {
      label: string
    }
  }
  /** Mapping of categories to details */
  categoryColours: {
      [category]: {
        label: string,
        colour: HTMLColour,
        contrastColour: HTMLColour
      }
  },
  /** Array of key dates to display on the chart */
  overlay: [
    {
      date: Date,
      label: string,
      persist: boolean,
      colour: HTMLColour
    }
    ...
  ],
  /** Labels for the controls */
  labels: [
    overlay: string,
    category: string,
    image: string,
    svg: string
  ]
  /** Toggle to define if controls are shown */
  showControls: boolean,
  /** Toggle to define if non-persisten overlay is shown by default (initial state ov overlay toggle) */
  showOverlay: boolean,
  /** Width of chart in pixels */
  chartWidth: number,
  /** Minimum height of chart in pixels */
  minHeight number,
  /** Hard-coded start date for chart */
  startDate: Date,
  /** Hard-coded end date for chart */
  endDate: Date,
  /** Overriden font-stack for chart */
  fontStack: string,
  /** Style to embed in the extracted SVG and for PNG generation */
  style: string,
  /** Minimum contrast to allow before selecting a standard contrasting colour - defaults to 165, lower numbers tend to keep the colour at the expense of accessibility */
  contrastClip: number,
}
```

## Notes

Available categories. If more than one category is provided,  the chart will render a selector to allow users to pick a category for display styling (colouring). If no categories are provided, a default style will be selected.

Generally the start / end date will be automatically derived from the data. You can set a hard-coded start and end end-date, which will truncate the values to approximately that timeline, although the chart library will pick a 'nice' start / end point (e.g. round to month), so that ticks look sensible.

The fontStack and style properties are related, and are currently set to the IfG preferred open fontstack (Open Sans). Basically, don't mess with these, unless you know what you're doing!

Title and notes will expand dynamically based on the number of string provided in the array. No checking for maximum length is performed.