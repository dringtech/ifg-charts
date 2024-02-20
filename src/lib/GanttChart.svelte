<script>
	import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';

	export let data;
	export let width = 800;
	export let rowHeight = 50;
  export let categoryColours = {};
  export let overlay;
  
  export let categoryName = 'default';

  const grid = {
    colour: '#999',
    width: '1',
    dashArray: 'none',
    background: 'none'
  };

  $: colour = scaleOrdinal(
    ['default', ...Object.keys(categoryColours)],
    ['#aaa', ...Object.values(categoryColours)]
  )

  const margin = { left: 40, top: 40, right: 40, bottom: 40 };

  // Convert date strings to actual dates and sort by start date
	$: _data = data.map((d) => ({
		...d,
		start: new Date(d.start),
		end: new Date(d.end)
	})).sort((a, b) => a.start - b.start);

	$: innerHeight = rowHeight * _data.length;
	$: innerWidth = width - margin.left - margin.right;
	$: height = innerHeight + margin.top + margin.bottom;

	$: xDomain = _data.map((d) => [d.start, d.end]).flat();
	$: yDomain = _data.map((d, i) => i);

	$: xScale = scaleTime()
		.domain([Math.min.apply(null, xDomain), Math.max.apply(null, xDomain)])
		.range([0, innerWidth])
		.nice();
	$: yScale = scaleBand().domain(yDomain).range([0, innerHeight]).padding(0.25);

  $: _overlay = overlay
    .map((o) => ({
      ...o,
      date: new Date(o.date),
    }))
    .filter((o) =>
      o.date >= Math.min(...xScale.domain()) &&
      o.date <= Math.max(...xScale.domain())
    )
  
  $: xFormatter = xScale.tickFormat();
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
	<g transform={`translate(${margin.left}, ${margin.top})`}>
		<rect width={innerWidth} height={innerHeight} fill={ grid.background } />

    {#each xScale.ticks(4) as tickValue}
			<g transform={`translate(${xScale(tickValue)},0)`}>
				<line y2={innerHeight}
              stroke={ grid.colour }
              stroke-width={ grid.width }
              stroke-dasharray={ grid.dashArray }
        />
				<text
					transform={ `translate(0,${innerHeight + 5})` }
					text-anchor="middle"
					dominant-baseline="hanging"
					text-rendering="optimizeLegibility"
          stroke={ grid.colour }
				>
					{ xFormatter(tickValue) }
				</text>
			</g>
		{/each}

    {#each _data as d, idx}
      <rect
        data-start={d.start}
        x={xScale(d.start)}
        y={yScale(idx)}
        width={xScale(d.end) - xScale(d.start)}
        height={yScale.bandwidth()}
        fill={ colour(d[categoryName] || 'default') }
      >
        <title>{d.label}</title>
      </rect>
      <text
        text-anchor="start"
        x="{ xScale(d.end) }"
        dx="5px"
        y={ yScale(idx) + yScale.bandwidth() / 2}
        dy=".32em"
        text-rendering="optimizeLegibility"
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
      />
      <text
        transform="translate(0,-10)"
        text-anchor="middle"
        dominant-baseline="text-top"
        text-rendering="optimizeLegibility"
      >
        { label }
      </text>
    </g>
    {/each}
	</g>
</svg>
