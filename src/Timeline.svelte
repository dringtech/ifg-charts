<script>
  import GanttChart from './lib/GanttChart.svelte';
  import ImageSaver, { exportPNG, exportSVG } from './lib/ImageSaver.svelte';

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
  export let showMarkers = true;

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
</script>

<div class="chart">
  <div class="controls">
    <div>
      <label for={ `${id}-marker-toggle` }>Show markers</label>
      <input id={ `${id}-marker-toggle` } type='checkbox' bind:checked={ markers }>
    </div>
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
      <button on:click={ exportPNG }>Save image</button>
      <button on:click={ exportSVG }>Save SVG</button>
    </div>
  </div>

  <ImageSaver>
    <GanttChart
      data={ _data }
      categoryName={ category }
      { categoryColours }
      overlay={ _overlay }
      width={ chartWidth }
    />
  </ImageSaver>
</div>
