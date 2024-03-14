<script>
  import { afterUpdate } from 'svelte';

  export let categories;
  export let fontSize;
  export let colourScale;
  export let categoryColours;
  export let width;
  export let top;

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
      legendMarkerPositions = [...legendMarkerPositions, { x, y }];
      x += legendItems[idx].getBBox().width / fontSize + 1;
      if (x * fontSize > width) {
        x = xGutter;
        y += 1.5;
      }
    }
  }

  afterUpdate(() => {
    setLegendItemWidth();
  });
</script>

<g transform={`translate(${ xShift }, ${ top })`} bind:this={legendEl}>
  {#each categories as cat, index}
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
      <text dx={fontSize * 1} fill={thisCategory.legendTextColour}
        >{thisCategory?.label || cat}</text
      >
    </g>
  {/each}
</g>
