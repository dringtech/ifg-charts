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

  const id = Math.floor(100000 + Math.random() * 900000)

  let category = categories[0] || undefined;
  let menuExpanded = false;

  function toggleMenu() {
    menuExpanded = !menuExpanded;
  }
</script>

<div class="chart">
  <div class="controls">
    <button aria-haspopup="true" aria-expanded={ menuExpanded } on:click={ toggleMenu }>
      Chart Controls
      <span aria-hidden="true">&#x25be;</span>
    </button>
    <div role="menu" hidden={ !menuExpanded }>
      <button role="menuitem">Export SVG</button>
      <button>Export PNG</button>
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
  />



<pre>
Category { category }
Markers { markers }
</pre>

</div>

<style>
  .chart {
    position: relative;
  }
  .controls {
    position: absolute;
    top: 0;
    right: 0;
    width: 10em;
    border-radius: 5px;
    border: 1px solid black;
  }
  .controls button {
    width: 100%;
    background: inherit;
    border: none;
    font: inherit;
    color: inherit;
  }
  [role=menu] {
    position: relative;
    right: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  [role=menu] > * + * {
    margin-top: 0.25em;
  }
  [role=menu] > button {
    color: white;
    background: black;
    border-radius: 20px;
    padding: 5px;
  }
  [hidden] {
    display: none;
  }
</style>