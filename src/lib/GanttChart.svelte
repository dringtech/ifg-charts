<script>
  import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';
  import { afterUpdate, getContext } from 'svelte';
  import Legend from './Legend.svelte';

  export let data;
  export let fontSize = 15;
  export let barFontSize = 16;
  export let rowHeight = barFontSize * 2.25;
  export let rowPadding = 0.25; // 25% top and 25% bottom = 50%
  export let categoryColours = {};
  export let overlay;
  export let categoryName = 'default';
  export let grid = {};
  export let margin = {};
  export let minWidth = 1.5;
  export let startDate = undefined;
  export let endDate = undefined;
  export let minHeight = 150;

  const chartWidth = getContext('width');
  export let chartHeight = 0;
  // const offset = getContext('offset');

  $: _margin = {
    left: fontSize * 4,
    right: fontSize * 4,
    top: fontSize * 3,
    bottom: fontSize * 5,
    ...margin,
  };
  const DEFAULT_CATEGORY_VALUE = 'default';

  $: _grid = {
    colour: '#999',
    labelColour: '#999',
    width: '1',
    dashArray: 'none',
    background: 'white',
    ...grid,
  };

  $: _categoryColours = {
    [DEFAULT_CATEGORY_VALUE]: {
      colour: '#aaa',
      label: 'Unknown',
      contrastColour: '#000',
    },
    ...categoryColours,
  };

  $: colourScale = scaleOrdinal(
    [...Object.keys(_categoryColours)],
    [...Object.values(_categoryColours).map((x) => x.colour || '#222')]
  );

  $: height = Math.max(rowHeight * data.length, minHeight);
  $: barOffset = Math.max(0, (height - rowHeight * data.length) / 2)
  $: width = chartWidth - _margin.left - _margin.right;

  $: xDomain = data.map((d) => [d.start, d.end]).flat();
  $: yDomain = data.map((d, i) => i);

  $: xScale = scaleTime()
    .domain([startDate|| Math.min.apply(null, xDomain), endDate || Math.max.apply(null, xDomain)])
    .range([0, width])
    .nice();
  $: [earliestDate, latestDate] = xScale.domain()

  $: yScale = scaleBand()
    .domain(yDomain)
    .range([0, rowHeight * data.length])
    .padding(rowPadding);

  $: _overlay = overlay.filter(
    (o) =>
      (o.date >= earliestDate) &&
      (o.date <= latestDate)
  );

  $: bars = data.map((b, idx) => {
    const barStartDate = Math.max(b.start, earliestDate);
    const barEndDate = Math.min(b.end, latestDate);
    const x = xScale(barStartDate);
    const y = yScale(idx);
    const width = Math.max(xScale(barEndDate) - x, minWidth);
    const height = yScale.bandwidth();
    const colour = colourScale(b[categoryName] || 'default');
    return {
      ...b,
      x,
      y,
      width,
      height,
      colour,
    };
  });

  $: calculatedTopMargin = Math.max(
    ..._overlay.map((o) => o.label.length * fontSize + 20),
    _margin.top
  );
  $: chartHeight = height + calculatedTopMargin + _margin.bottom;

  // Get list of categories
  $: categories = Array.from(
    data.reduce(
      (a, d) => a.add(d[categoryName] || DEFAULT_CATEGORY_VALUE),
      new Set()
    )
  ).sort((a, b) => (a < b ? -1 : 1));

  $: xFormatter = xScale.tickFormat();

  let labelsEl;
  let labelPositions = [];

  function calculateLabelPositions() {
    labelPositions = [];
    const labels = Array.from(labelsEl.querySelectorAll('g'));

    for (const i in labels) {
      const l = labels[i];
      const [label] = Array.from(l.querySelectorAll('text'));

      const bar = {
        start: bars[i].x,
        width: bars[i].width,
        category: data[i][categoryName],
      };
      let labelConfig;
      if (bar.width - fontSize > label.getComputedTextLength()) {
        labelConfig = {
          x: bar.start + bar.width / 2,
          textAnchor: 'middle',
          fill: _categoryColours[bar.category || DEFAULT_CATEGORY_VALUE].contrastColour,
          halo: colourScale(bar.category),
          dx: undefined,
        };
      } else if (bar.start + bar.width + label.getComputedTextLength() + fontSize > width) {
        labelConfig = {
          x: bar.start,
          textAnchor: 'end',
          dx: -fontSize / 2,
          halo: _grid.background,
          fill: _categoryColours[bar.category || DEFAULT_CATEGORY_VALUE].legendTextColour || 'black',
        };
      } else {
        labelConfig = {
          x: bar.start + bar.width,
          dx: fontSize / 2,
          textAnchor: 'start',
          halo: _grid.background,
          fill: _categoryColours[bar.category || DEFAULT_CATEGORY_VALUE].legendTextColour || 'black',
        };
      }
      labelPositions = [...labelPositions, labelConfig];
    }
  }

  afterUpdate(() => {
    calculateLabelPositions();
  });
</script>
<svelte:options accessors />

<g
  transform={`translate(${_margin.left}, ${calculatedTopMargin})`}
  font-size={fontSize}
>
  <rect {width} {height} fill={_grid.background} />

  {#each xScale.ticks(4) as tickValue}
    <g transform={`translate(${xScale(tickValue)},0)`}>
      <line
        y2={height}
        stroke={_grid.colour}
        stroke-width={_grid.width}
        stroke-dasharray={_grid.dashArray}
      />
      <text
        transform={`translate(0,${height + fontSize / 2 })`}
        text-anchor="middle"
        dominant-baseline="hanging"
        fill={_grid.labelColour}
        text-rendering="optimizeLegibility"
      >
        {xFormatter(tickValue)}
      </text>
    </g>
  {/each}

  {#each bars as d, idx (idx)}
    <rect
      data-start={d.start}
      x={d.x}
      y={d.y + barOffset}
      width={d.width}
      height={d.height}
      fill={d.colour}
    >
      <title>{d.label}</title>
    </rect>
  {/each}

  {#each _overlay as { date, label, colour }}
    {@const _colour = colour || 'black'}
    <g transform={`translate(${xScale(date)},0)`}>
      <line
        y2={height}
        stroke={_colour}
        stroke-width="2"
        stroke-dasharray="10 5"
      />
      <text
        transform="translate(0,-10)"
        fill={_colour}
        text-anchor="middle"
        dominant-baseline="text-top"
        text-rendering="optimizeLegibility"
      >
        {#each label.toReversed() as line, idx}
          <tspan x="0" y={-idx * fontSize}>{line}</tspan>
        {/each}
      </text>
    </g>
  {/each}

  <g bind:this={labelsEl} font-size={ barFontSize }>
    {#each data as d, idx}
      {@const labelConfig = labelPositions[idx]}
      <g transform={`translate(${labelConfig?.x || 0} ${yScale(idx)})`}>
        <text
          dx={labelConfig?.dx}
          dy={yScale.bandwidth() / 2 + barOffset}
          text-anchor={labelConfig?.textAnchor}
          dominant-baseline="middle"
          fill={labelConfig?.fill}
          text-rendering="optimizeLegibility"
          paint-order="stroke"
          stroke-width={fontSize / 2}
          stroke-opacity={ 0.7 }
          stroke={ labelConfig?.halo || _grid.background}
        >
          {d.label}
        </text>
      </g>
    {/each}
  </g>
  {#if categories.length > 0}
  <Legend
    categories={ categories }
    fontSize={ fontSize }
    colourScale={ colourScale }
    width={ width }
    top={ height + 50 }
    categoryColours={ _categoryColours }
  />
  {/if}
</g>
