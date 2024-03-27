<script>
  import { afterUpdate } from 'svelte';

  export let categories;
  export let fontSize;
  export let colourScale;
  export let categoryColours;
  export let width;
  export let top;

  // Attempt to order per the object provided
  $: orderedCategories = Object.keys(categoryColours)
    .filter(c => categories.includes(c));

  /**
   * Automatically re-assigns legend item positioning based on longest item.
   */
  let legendEl;
  let legendMarkerPositions = [];
  let xShift = 0;

  function setLegendItemWidth() {
    if (!legendEl) return;
    const legendItems = Array.from(
      legendEl?.querySelectorAll('g').values() || []
    );
    legendMarkerPositions = [];
    const xGutter = 0;
    let x = xGutter;
    let y = 0;
    for (const idx in legendItems) {
      const currentItemWidth = legendItems[idx].getBBox().width;
      if ((x * fontSize + currentItemWidth) > width) {
        x = xGutter;
        y += 1.5;
      }
      legendMarkerPositions = [...legendMarkerPositions, { x, y }];
      x += currentItemWidth / fontSize + 1;
    }
  }

  afterUpdate(() => {
    setLegendItemWidth();
  });
</script>

<g transform={`translate(${ xShift }, ${ top })`} bind:this={legendEl}>
  {#each orderedCategories as cat, index}
    {@const thisCategory = categoryColours[cat]}
    {@const offset = legendMarkerPositions[index] || { x: 0, y: 0 }}
    <g
      transform={`translate(${fontSize * offset.x} ${fontSize * offset.y})`}
    >
      <rect
        y={-(fontSize - 2)}
        width={fontSize - 2}
        height={fontSize - 2}
        fill={colourScale(cat)}
      />
      <text dx={fontSize * 1} fill={thisCategory?.legendTextColour }
        >{thisCategory?.label || cat}</text
      >
    </g>
  {/each}
</g>
