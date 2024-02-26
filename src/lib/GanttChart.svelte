<script>
	import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';
	import { afterUpdate } from 'svelte';

	export let data;
	export let width = 800;
  export let fontSize = 10;
	export let rowHeight = 25;          // Row height 25px
  export let rowPadding = 0.25;       // 25% top and 25% bottom = 50%
  export let categoryColours = {};
  export let overlay;
  export let categoryName = 'default';
  export let grid = {};

  const margin = { left: 40, top: 40, right: 40, bottom: 60 };

  $: _grid = {
    colour: '#999',
    width: '1',
    dashArray: 'none',
    background: 'none',
    ...grid
  };

  $: colour = scaleOrdinal(
    ['default', ...Object.keys(categoryColours)],
    ['#aaa', ...Object.values(categoryColours).map(x => x.colour || '#777')]
  )

	$: innerHeight = rowHeight * data.length;
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
    .range([0, innerHeight])
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
      data.reduce((a, d) => a.add(d[categoryName]), new Set())
    ).sort((a, b) => a < b ? -1 : 1);

  $: xFormatter = xScale.tickFormat();

  const labelPos = (d) => {
    const start = xScale(d.start);
    const end = xScale(d.end);
  
    if (end > innerWidth * 0.6) {
      return {
        x: start,
        dx: '-5px',
        'text-anchor': 'end'
      }
    }
    
    return {
      x: end,
      dx: '5px',
      'text-anchor': 'start'
    }
  }

  /**
   * Automatically re-assigns legend item positioning based on longest item.
   */
  let legendEl;
  let legendItemWidth = 10;

  function setLegendItemWidth() {
    if (!legendEl) return;
    const legendItems = Array.from(legendEl?.querySelectorAll('g').values() || []);
    legendItemWidth = Math.max(...legendItems.map(x => x.getBBox().width)) / fontSize;
  }
  
  afterUpdate(() => {
    setLegendItemWidth();
	});
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
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
      <text {...labelPos(d)}
            y={ yScale(idx) + yScale.bandwidth() / 2}
            dy=".32em"
            text-rendering="optimizeLegibility"
            vector-effect="non-scaling-stroke"
      >
        {d.label}
      </text>
    {/each}

    {#each _overlay as { date, label }}
    <g transform={`translate(${xScale(date)},0)`}>
      <line y2={innerHeight}
            stroke="black"
            stroke-width="2"
            stroke-dasharray="10 5"
            vector-effect="non-scaling-stroke"
      />
      <text transform="translate(0,-10)"
            text-anchor="middle"
            dominant-baseline="text-top"
            text-rendering="optimizeLegibility"
            vector-effect="non-scaling-stroke"
      >
        {#each label.reverse() as line, idx}
          <tspan x=0 y={ -idx * fontSize }>{ line }</tspan>
        {/each}
      </text>
    </g>
    {/each}
    <g transform={ `translate(0, ${ innerHeight + 50 })`} bind:this={ legendEl }>
      <text>Legend:</text>
      {#each categories as cat, index}
      <g transform={ `translate(${ fontSize * ( 5 + index * (legendItemWidth + 1)) })`}>
      <rect y={ -(fontSize - 4) } width={ fontSize - 4 } height={ fontSize - 4 } fill={ colour(cat) }/>
      <text x={ fontSize } >{ categoryColours[cat]?.label || cat }</text>
      </g>
      {/each}
    </g>
	</g>
</svg>
