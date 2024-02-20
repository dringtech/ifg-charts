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

  const id = Math.floor(100000 + Math.random() * 900000)

  let category = categories[0] || undefined;
  let menuExpanded = false;

  function toggleMenu() {
    menuExpanded = !menuExpanded;
  }

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
    <button aria-haspopup="true" aria-expanded={ menuExpanded } on:click={ toggleMenu }>
      Chart Controls
      <span aria-hidden="true">{#if menuExpanded }&#x2212{:else}&#x002B;{/if}</span>
    </button>
    <div role="menu" hidden={ !menuExpanded }>
      <button role="menuitem" on:click={ exportPNG }>Save image</button>
      <button role="menuitem" on:click={ exportSVG }>Save SVG</button>
      <div>
        <input id={ `${id}-marker-toggle` } type='checkbox' bind:checked={ markers }>
        <label for={ `${id}-marker-toggle` }>Toggle markers</label>
      </div>
      {#if categories.length > 1}
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
      {/if}
    </div>
  </div>

  <div class="render-wrapper">
    <GanttChart
      { data }
      categoryName={ category }
      { categoryColours }
      overlay={ markers ? overlay : [] }
    />
  </div>
<pre>
Category { category }
Markers { markers }
</pre>

</div>

<style>
  .controls {
    position: relative;
    width: 10em;
    color: yellow;
    background: #333;
  }
  .controls button {
    width: 100%;
    font: inherit;
    border: none;
    outline: none;
    background: inherit;
    color: inherit;
  }
  [role=menu] {
    position: absolute;
    background: inherit;
    border: inherit;
    right: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  [role=menu] > * + * {
    margin-top: 0.25em;
  }
  [role=menu] > button {
    color: #333;
    background: yellow;
    border-radius: 20px;
    padding: 5px;
  }
  [hidden] {
    display: none;
  }
</style>