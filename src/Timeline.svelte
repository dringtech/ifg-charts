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

  // Convert date strings to actual dates and sort by start date
	$: _data = data.map((d) => ({
		...d,
		start: new Date(d.start),
		end: new Date(d.end)
	})).sort((a, b) => a.start - b.start);

  // Convert date strings to actual dates, split labels ny spaces if not aleady an array
  $: _overlay = markers ? overlay.map((o) => ({
    ...o,
    label: Array.isArray(o.label) ? o.label : o.label.split(/\s+/),
    date: new Date(o.date),
  })) : []

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
      data={ _data }
      categoryName={ category }
      { categoryColours }
      overlay={ _overlay }
      width={ chartWidth }
    />
  </div>
</div>
