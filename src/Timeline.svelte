<script>
  import { toPng } from 'dom-to-image-more';
  import GanttChart from './lib/GanttChart.svelte';

  export let data = [];
  export let categories = [];
  export let categoryColours = {
    'Labour': 'red',
    'Conservative': 'blue',
    
    'male': 'green',
    'female': 'purple',
  }
  export let markers = true;
  export let overlay = [];

  const chartWidth = 800;

  const id = Math.floor(100000 + Math.random() * 900000)

  let category = categories[0] || undefined;

  const getRenderWrapper = (node) => {
    return node.closest('div.chart').querySelector('.render-wrapper');
  }
  const downloadLink = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename
    link.href = dataUrl;
    link.click();
  }

  function exportSVG() {
    const svg = getRenderWrapper(this).querySelector('svg')
    const serializer = new XMLSerializer();
    // TODO add styles - defs entry?
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    const dataUrl = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    downloadLink(dataUrl, 'chart.svg');
  }

  async function exportPNG() {
    let dataUrl;
    try {
      dataUrl = await toPng(getRenderWrapper(this));
    } catch(e) {
      console.error('Failed to render PNG', e);
    }
    downloadLink(dataUrl, 'chart.png');
  }
</script>

<div class="chart">
  <div class="controls">
    <div>
      <label for={ `${id}-marker-toggle` }>Show markers</label>
      <input id={ `${id}-marker-toggle` } type='checkbox' bind:checked={ markers }>
    </div>
    {#if categories.length > 1}
    <div>
      <div>Colour by category:</div>
      {#each categories as c, i}
      <div>
        <input
          id={ `${id}-category-${i}` }
          type='radio'
          value={ c }
          name='category'
          bind:group={ category }
        >
        <label for={ `${id}-category-${i}` }>{ c }</label>
      </div>
      {/each}
    </div>
    {/if}
    <div>
      <button on:click={ exportPNG }>Save image</button>
      <button on:click={ exportSVG }>Save SVG</button>
    </div>
  </div>

  <div class="render-wrapper" style={ `--content-width: ${ chartWidth }px;`}>
    <GanttChart
      { data }
      categoryName={ category }
      { categoryColours }
      overlay={ markers ? overlay : [] }
      width={ chartWidth }
    />
  </div>
</div>

<style>
  .controls {
    position: relative;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: center;
    color: yellow;
    background: #333;
  }
  .controls > * {
    gap: inherit;
    display: inherit;
  }
  .controls > *:not(:last-child) {
    padding-inline-end: 10px;
    border-right: 2px solid yellow;
  }
  .controls button {
    font: inherit;
    border: initial;
    color: #333;
    background: yellow;
    border-radius: 20px;
    padding: 5px 20px;
  }
  .controls button:hover {
    text-decoration: underline;
  }
  .controls button:active {
    background: white;
  }
  .render-wrapper {
    overflow-x: auto;
  }
  .render-wrapper > :global(svg) {
    min-width: var(--content-width);
  }
</style>