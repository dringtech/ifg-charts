<script>
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

  function exportSVG() {
    const svg = this.closest('div.chart').querySelector('svg');
    const serializer = new XMLSerializer();
    // TODO add styles - defs entry?
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    const link = document.createElement("a");
    link.download = 'chart.svg';
    link.href = url;
    link.click();
  }
</script>

<div class="chart">
  <div class="controls">
    <button aria-haspopup="true" aria-expanded={ menuExpanded } on:click={ toggleMenu }>
      Chart Controls
      <span aria-hidden="true">{#if menuExpanded }&#x2212{:else}&#x002B;{/if}</span>
    </button>
    <div role="menu" hidden={ !menuExpanded }>
      <button role="menuitem" on:click={ exportSVG }>Export SVG</button>
      <button role="menuitem">Export PNG</button>
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

  <GanttChart
    { data }
    categoryName={ category }
    { categoryColours }
    overlay={ markers ? overlay : [] }
  />

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