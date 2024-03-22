<script lang="ts">
  import type { TimelineEntry, OverlayEntry, CategoryDetails } from './timeline.d.ts';
  import SvgWrapper from './lib/SvgWrapper.svelte';
  import GanttChart from './lib/GanttChart.svelte';
  import TopBar from './lib/TopBar.svelte';
  import BottomBar from './lib/BottomBar.svelte';
  import { ImageSaver } from '@dringtech/svelte-blocks';
  import { contrastColour, highContrast } from './contrast.js';

  /** Data to be visualised. */
  export let data: TimelineEntry[] = [];

  /** Title for chart */
  export let title = [];

  /** Notes for chart */
  export let notes = [];

  /** List of categories */
  export let categories: Record<string, { label?: string }> = {};

  /** Mapping of categories to details */
  export let categoryColours: Record<string, CategoryDetails> = {};

  /** Array of key dates to display on the chart */
  export let overlay: OverlayEntry[] = [];

  /** Labels for the controls */
  export let labels: {
    overlay?: string,
    category?: string,
    image?: string,
    svg?: string,
  } = {};

  /** Toggle to define if controls are shown */
  export let showControls = true;

  /** Toggle to define if overlay is shown */
  export let showOverlay = true;

  /** Width of chart in pixels */
  export let chartWidth = 1024;
  export let minHeight = 200;

  /** Start and end date overrides */
  export let startDate = undefined;
  export let endDate = undefined;

  /** Style overrides */
  export let fontStack = '"Open Sans", sans-serif';
  export let style = `
    @font-face {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 300 800;
      font-stretch: 100%;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  `;

  /**
   * A generated id that uniquely identifies the component.
   * Mainly used in input to label bindings
   */
  const id = Math.floor(100000 + Math.random() * 900000)

  const backgroundColour = 'white';

  /**
   * The currently selected category. Defaults to the first category
   * if categories are provided or `undefined` if not.
   */
  export let category = Object.keys(categories)[0] || undefined;

  /** Image saver reference */
  let saver: ImageSaver;

  // Convert date strings to actual dates and sort by start date
	$: _data = data.map((d) => ({
		...d,
		start: new Date(d.start),
		end: new Date(d.end),
    [category]: Object.keys(_categoryColours).includes(d[category]) ? d[category] : GanttChart.DEFAULT_CATEGORY_VALUE,
	})).sort((a, b) => a.start.getTime() - b.start.getTime());

  // Convert date strings to actual dates, split labels by spaces if not aleady an array
  $: _overlay = overlay.map((o) => ({
    colour: '#333f48',
    ...o,
    label: Array.isArray(o.label) ? o.label : o.label.split(/\s+/),
    date: new Date(o.date),
  }))
  // .filter(o => showOverlay || o.persist)

  $: _categories = Object.entries(categories).reduce(
    (c, [k, v]) => ({
      ...c,
      [k]: { label: k, ...v }
    }),
    {}
  ) as Record<string, { label: string }>;

  $: _categoryColours = Object.entries(categoryColours).reduce((a, [k, c]) => ({
    ...a,
    [k]: {
      ...c,
      contrastColour: c?.contrastColour || contrastColour(c?.colour),
      legendTextColour:
        highContrast(c?.colour, backgroundColour, 250) ?
          c?.colour :
          contrastColour(backgroundColour, 'white', '#333f48'),
    },
  }), {})

  $: svgOpts = {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'font-family': fontStack, 
    style:`background:${ backgroundColour };`,
  }
  let topBar;
  let chart;
  let bottomBar;

  $: chartOffset = topBar?.barHeight || 0;
  $: height = chartOffset + chart?.chartHeight + bottomBar?.barHeight;

  export function savePngHandler(e) {
    e.stopPropagation();
    saver.exportPNG('timeline.png');
  }
  export function saveSvgHandler(e) {
    e.stopPropagation();
    saver.exportSVG('timeline.svg');
  }
</script>

<!-- 
  @component
  
  App that displays a Timeline chart, with optional controls.
-->
<div class="ifg-chart">
  {#if showControls }
  <div class="controls">
    {#if _overlay.length > 0}
    <div class="markers">
      <input id={ `${id}-marker-toggle` } type='checkbox' bind:checked={ showOverlay }>
      <label for={ `${id}-marker-toggle` }>{ labels.overlay || "Show overlay" }</label>
    </div>
    {/if}
    {#if Object.keys(_categories).length > 1}
    <div class="colour-coding">
      <label for={ `${id}-category-selector` }>{ labels.category || "Category" }</label>
      <select id={ `${id}-category-selector` } bind:value={ category }>
        {#each Object.entries(_categories) as [catId, cat] (catId)}
        <option value={ catId }>{ cat.label }</option>
        {/each}
      </select>
    </div>
    {/if}
    <div class="buttons">
      <div>Download:</div>
      <button title="Download timeline as SVG" on:click={ saveSvgHandler }>{ @html labels.svg || "SVG" }</button>
      <button title="Download timeline as PNG" on:click={ savePngHandler }>{ @html labels.image || "PNG" }</button>
    </div>
  </div>
  {/if}

  <ImageSaver bind:this={ saver }>
    <SvgWrapper
      width={ chartWidth }
      { height }
      style={ style }
      opts={ svgOpts }>
      <TopBar { title } fontSize={ 20 } bind:this={topBar}/>
      <g transform={ `translate(0 ${ chartOffset })` }>
      <GanttChart
        data={ _data }
        startDate={ startDate && new Date(startDate) }
        endDate={ endDate && new Date(endDate) }
        categoryName={ category }
        categoryColours={ _categoryColours }
        overlay={ _overlay.filter(o => showOverlay || o.persist) }
        fontSize={ 15 }
        barFontSize={ 16 }
        minHeight={ minHeight }
        grid={
          {
            background: backgroundColour,
            colour: '#F3F3F4',
            labelColour: '#333F48',
          }
        }
        bind:this={chart}
      />
      </g>
      <BottomBar { notes } fontSize={ 15 } bind:this={ bottomBar }/>
    </SvgWrapper>
  </ImageSaver>
</div>
