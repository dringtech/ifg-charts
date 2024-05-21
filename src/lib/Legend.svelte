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
    let positions = [];
    const lineLengths = [];
    const xGutter = 0;
    let x = xGutter;
    let y = 0;
    let line = 0;
    for (const idx in legendItems) {
      const currentItemWidth = legendItems[idx].getBBox().width;
      if ((x * fontSize + currentItemWidth) > width) {
        x = xGutter;
        y += 1.5;
        line++;
      }
      positions = [...positions, { x, y, line }];
      const scaledWidth = currentItemWidth / fontSize + 1
      x += scaledWidth;
      // Set new lines to -1 to account for extra gap in added in at end of scaledWidth
      lineLengths[line] = (lineLengths[line] || -1) + scaledWidth;
    }
    const lineOffsets = lineLengths.map(x => ((width / fontSize) - x) / 2);
    legendMarkerPositions = positions.map(({x, y, line}) => ({
      x: x + lineOffsets[line],
      y: y
    }));
  }

  afterUpdate(() => {
    setLegendItemWidth();
  });
</script>

<g transform={`translate(${ xShift }, ${ top })`} bind:this={legendEl} font-size={ fontSize }>
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
      <text dx={fontSize * 1} fill={thisCategory?.legendTextColour } font-weight={ 600 }
        >{thisCategory?.label || cat}</text
      >
    </g>
  {/each}
</g>
