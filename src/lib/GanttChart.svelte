<script>
	import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';
	import { afterUpdate } from 'svelte';

	export let data;
	export let width = 800;
  export let fontSize = 10;
	export let rowHeight = 25;          // Row height 25px
  export let rowPadding = 0.25;       // 25% top and 25% bottom = 50%
  export let categoryColours = {};
  export let minHeight = 0;
  export let overlay;
  export let categoryName = 'default';
  export let grid = {};

  const margin = { left: 40, top: 40, right: 40, bottom: 80 };
  const DEFAULT_CATEGORY_VALUE = 'default'

  $: _grid = {
    colour: '#999',
    width: '1',
    dashArray: 'none',
    background: 'white',
    ...grid
  };

  $: _categoryColours = {
    [DEFAULT_CATEGORY_VALUE]: {
      colour: '#aaa',
      label: 'Unknown'
    },
    ...categoryColours
  }

  $: colour = scaleOrdinal(
    [...Object.keys(_categoryColours)],
    [...Object.values(_categoryColours).map(x => x.colour || '#222')]
  )  

	$: innerHeight = Math.max(rowHeight * data.length, minHeight);
	$: innerWidth = width - margin.left - margin.right;

	$: xDomain = data.map((d) => [d.start, d.end]).flat();
	$: yDomain = data.map((d, i) => i);

	$: xScale = scaleTime()
		.domain([
      Math.min.apply(null, xDomain),
      Math.max.apply(null, xDomain)
    ])
		.range([0, innerWidth])
		.nice();
	$: yScale = scaleBand()
    .domain(yDomain)
    .range([0, rowHeight * data.length])
    .padding(rowPadding);

  $: _overlay = overlay
    .filter((o) =>
      o.date >= Math.min(...xScale.domain()) &&
      o.date <= Math.max(...xScale.domain())
    )

  $: calculatedTopMargin = Math.max(..._overlay.map(o => o.label.length * fontSize + 20), margin.top);
	$: height = innerHeight + calculatedTopMargin + margin.bottom;

  // Get list of categories
  $: categories = Array.from(
      data.reduce((a, d) => a.add(d[categoryName] || DEFAULT_CATEGORY_VALUE), new Set())
    ).sort((a, b) => a < b ? -1 : 1);

  $: xFormatter = xScale.tickFormat();

  const labelPos = (d) => {
    const start = xScale(d.start);
    const end = xScale(d.end);
    const length = end - start;

    // Naive layout
    if (length > 30) {
      return {
        x: start + length / 2,
        'text-anchor': 'middle',
        fill: _categoryColours[d[categoryName]].contrastColour,
        halo: colour(d[categoryName]),
      }
    };
    const boundary = 1.0;
  
    if (end > innerWidth * boundary) {
      return {
        x: start,
        dx: '-5px',
        'text-anchor': 'end',
        fill: 'black'
      }
    }
    
    return {
      x: end,
      dx: '5px',
      'text-anchor': 'start',
      fill: 'black'
    }
  }

  /**
   * Automatically re-assigns legend item positioning based on longest item.
   */
  let legendEl;
  let legendMarkerPositions = [];

  function setLegendItemWidth() {
    if (!legendEl) return;
    const legendItems = Array.from(legendEl?.querySelectorAll('g').values() || []);
    legendMarkerPositions = [];
    const xGutter = 5;
    let x = xGutter;
    let y = 0;
    for (const idx in legendItems) {
      legendMarkerPositions = [...legendMarkerPositions, { x, y }];
      x += legendItems[idx].getBBox().width / fontSize + 1;
      if (x * fontSize > innerWidth) {
        x = xGutter;
        y += 1.5;
      }
    }
  }
  
  afterUpdate(() => {
    setLegendItemWidth();
	});
</script>

<svg viewBox={`0 0 ${width} ${height}`} stroke-linecap="round" stroke-linejoin="round">
	<g transform={`translate(${margin.left}, ${calculatedTopMargin})`} font-size={ fontSize }>
		<rect width={innerWidth} height={innerHeight} fill={ _grid.background } />

    {#each xScale.ticks(4) as tickValue}
			<g transform={`translate(${xScale(tickValue)},0)`}>
				<line y2={innerHeight}
              stroke={ _grid.colour }
              stroke-width={ _grid.width }
              stroke-dasharray={ _grid.dashArray }
              vector-effect="non-scaling-stroke"
        />
				<text transform={ `translate(0,${innerHeight + 5})` }
              text-anchor="middle"
              dominant-baseline="hanging"
              fill={ _grid.colour }
              text-rendering="optimizeLegibility"
              vector-effect="non-scaling-stroke"
				>
					{ xFormatter(tickValue) }
				</text>
			</g>
		{/each}

    {#each data as d, idx}
      <rect data-start={d.start}
            x={xScale(d.start)}
            y={yScale(idx)}
            width={xScale(d.end) - xScale(d.start)}
            height={yScale.bandwidth()}
            fill={ colour(d[categoryName] || 'default') }
            vector-effect="non-scaling-stroke"
      >
        <title>{d.label}</title>
      </rect>
    {/each}

    {#each _overlay as { date, label, colour }}
    {@const _colour = colour || 'black'}
    <g transform={`translate(${xScale(date)},0)`}>
      <line y2={innerHeight}
            stroke={ _colour }
            stroke-width="2"
            stroke-dasharray="10 5"
            vector-effect="non-scaling-stroke"
      />
      <text transform="translate(0,-10)"
            fill={ _colour }
            text-anchor="middle"
            dominant-baseline="text-top"
            text-rendering="optimizeLegibility"
            vector-effect="non-scaling-stroke"
      >
        {#each label.toReversed() as line, idx}
          <tspan x=0 y={ -idx * fontSize }>{ line }</tspan>
        {/each}
      </text>
    </g>
    {/each}

    {#each data as d, idx}
      {@const p = labelPos(d) }
      <g transform={ `translate(${ p.x } ${ yScale(idx) })` }>
        <text
          dx={ p.dx }
          dy={ yScale.bandwidth() / 2 }
          text-anchor={ p['text-anchor'] }
          dominant-baseline="middle"
          text-rendering="optimizeLegibility"
          vector-effect="non-scaling-stroke"
          stroke-width={ fontSize }
          stroke={ p.halo || _grid.background }
        >
          {d.label}
        </text>
        <text
          dx={ p.dx }
          dy={ yScale.bandwidth() / 2 }
          fill={ p.fill || "red" }
          text-anchor={ p['text-anchor'] }
          dominant-baseline="middle"
          text-rendering="optimizeLegibility"
          vector-effect="non-scaling-stroke"
        >
          {d.label}
        </text>
      </g>
    {/each}

    {#if categories.length > 1}
    <g transform={ `translate(0, ${ innerHeight + 50 })`} bind:this={ legendEl }>
      <text>Legend:</text>
      {#each categories as cat, index}
      {@const offset = legendMarkerPositions[index] || { x: 0, y: 0} }
      <g transform={ `translate(${ fontSize * offset.x } ${ fontSize * offset.y })`}>
        <rect y={ -(fontSize - 4) } width={ fontSize - 4 } height={ fontSize - 4 } fill={ colour(cat) }/>
        <text x={ fontSize } >{ _categoryColours[cat]?.label || cat }</text>
      </g>
      {/each}
    </g>
    {/if}
	</g>
</svg>
