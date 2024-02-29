<script lang="ts">
  import type { TimelineEntry, OverlayEntry } from './timeline.d.ts';
  import GanttChart from './lib/GanttChart.svelte';
  import { ImageSaver } from '@dringtech/svelte-blocks';

  /** Data to be visualised. */
  export let data: TimelineEntry[] = [];

  /** List of categories */
  export let categories = [];
  // TODO Convert to list of objects with id and optional label

  /** Mapping of categories to colours */
  export let categoryColours = {};

  /** Array of key dates to display on the chart */
  export let overlay: OverlayEntry[] = [];

  /** Toggle to define if controls are shown */
  export let showControls = true;

  /** Toggle to define if overlay is shown */
  export let showOverlay = true;

  /** Width of chart in pixels */
  export let chartWidth = 800;

  /**
   * A generated id that uniquely identifies the component.
   * Mainly used in input to label bindings
   */
  const id = Math.floor(100000 + Math.random() * 900000)

  /**
   * The currently selected category. Defaults to the first category
   * if categories are provided or `undefined` if not.
   */
  let category = categories[0] || undefined;

  /** Image saver reference */
  let saver: ImageSaver;

  // Convert date strings to actual dates and sort by start date
	$: _data = data.map((d) => ({
		...d,
		start: new Date(d.start),
		end: new Date(d.end)
	})).sort((a, b) => a.start.getTime() - b.start.getTime());

  // Convert date strings to actual dates, split labels by spaces if not aleady an array
  $: _overlay = overlay.map((o) => ({
    colour: '#333f48',
    ...o,
    label: Array.isArray(o.label) ? o.label : o.label.split(/\s+/),
    date: new Date(o.date),
  })).filter(o => showOverlay || o.persist)
</script>

<!-- 
  @component
  
  App that displays a Timeline chart, with optional controls. Use as follows.

  ```tsx
    <Timeline   data={ [{ start: "2023-01-02", end: '2024-02-01', label: 'Label', propA: 'category-value-a' }] }
                categories={ { propA: 'Property A' } }
                colourScale={ { 'category-value-a': { colour: "#aaa", label: "Category A" } } }
                overlays={ [{ date: '2023-06-04', label: 'Overlay 1' }] }
                width="800"
                showControls={ true } showOverlay={ true }
    ></Timeline>
    ```
-->
<div class="chart">
  {#if showControls }
  <div class="controls">
    {#if _overlay.length > 0}
    <div>
      <label for={ `${id}-marker-toggle` }>Show markers</label>
      <input id={ `${id}-marker-toggle` } type='checkbox' bind:checked={ showOverlay }>
    </div>
    {/if}
    {#if categories.length > 1}
    <div>
      <label for={ `${id}-category-selector` }>Colour by category</label>
      <select id={ `${id}-category-selector` } bind:value={ category }>
        {#each categories as cat, i (cat)}
        <option>{ cat }</option>
        {/each}
      </select>
    </div>
    {/if}
    <div>
      <button on:click={ () => saver.exportPNG('timeline.png') }>Save image</button>
      <button on:click={ () => saver.exportSVG('timeline.svg') }>Save SVG</button>
    </div>
  </div>
  {/if}

  <ImageSaver bind:this={ saver }>
    <GanttChart
      data={ _data }
      categoryName={ category }
      { categoryColours }
      overlay={ _overlay }
      width={ chartWidth }
    />
  </ImageSaver>
</div>
