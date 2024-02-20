# IfG Timeline visualisation

This is a Svelte component which builds a timeline chart based on provided data:

Planned usage:

```html
    <div id="timeline-chart"></div>
    <script type="module">
      import { timeline } from '/src/charts.js';

      const options = {
        categories: [ 'Category A', 'Category B' ],
        markers: true,
      }

      timeline("timeline-chart", options);
    </script>
```

Expected options format:

```json
{
  "title": string,
  "data": [
    {
      "start": Date, "end": date,
      "label": string,
      [category]: string
    },
    ...
  ],
  "overlay": [
    { "date": Date, "label": string }
  ],
  "markers": boolean,
  "colours": {
    [category]: html colour string
  }
}
```

Options:

* `categories` Available categories. If more than one category is provided,
  the chart will render a selector to allow users to pick a category for display styling (colouring).
  If no categories are provided, a default style will be selected.
* `markers` Specify whether separate markers will be displayes.

