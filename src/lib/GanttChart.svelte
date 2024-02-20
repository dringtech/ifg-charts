<script>
	import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';

	export let data;
	export let width = 800;
	export let rowHeight = 50;
  export let categoryColours = {};
  
  export let categoryName = 'default';

  const grid = {
    color: '#999',
    width: '1',
    dashArray: 'none',
    background: 'none'
  };

  $: colour = scaleOrdinal(
    ['default', ...Object.keys(categoryColours)],
    ['#aaa', ...Object.values(categoryColours)]
  )

  const margin = { left: 20, top: 20, right: 20, bottom: 40 };

  // Convert date strings to actual dates and sort by start date
	$: _data = data.map((d) => ({
		...d,
		start: new Date(d.start),
		end: new Date(d.end)
	})).sort((a, b) => a.start - b.start);

	$: innerHeight = rowHeight * data.length;
	$: innerWidth = width - margin.left - margin.right;
	$: height = innerHeight + margin.top + margin.bottom;

	$: xDomain = _data.map((d) => [d.start, d.end]).flat();
	$: yDomain = _data.map((d, i) => i);

	$: xScale = scaleTime()
		.domain([Math.min.apply(null, xDomain), Math.max.apply(null, xDomain)])
		.range([0, innerWidth])
		.nice();
	$: yScale = scaleBand().domain(yDomain).range([0, innerHeight]).padding(0.25);

  $: xFormatter = xScale.tickFormat();
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
	<g transform={`translate(${margin.left}, ${margin.top})`}>
		<rect width={innerWidth} height={innerHeight} fill={ grid.background } />
		{#each xScale.ticks(4) as tickValue}
			<g transform={`translate(${xScale(tickValue)},0)`}>
				<line y2={innerHeight}
              stroke={ grid.color }
              stroke-width={ grid.width }
              stroke-dasharray={ grid.dashArray }
        />
				<text
					transform={ `translate(0,${innerHeight + 15})` }
					text-anchor="middle"
					dominant-baseline="middle"
					text-rendering="optimizeLegibility"
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
	</g>
</svg>
