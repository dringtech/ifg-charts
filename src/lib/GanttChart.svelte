<script>
  import { scaleBand, scaleTime, scaleOrdinal } from 'd3-scale';
  import { afterUpdate, getContext } from 'svelte';

  export let data;
  export let fontSize = 10;
  export let rowHeight = 25; // Row height 25px
  export let rowPadding = 0.25; // 25% top and 25% bottom = 50%
  export let categoryColours = {};
  export let overlay;
  export let categoryName = 'default';
  export let grid = {};
  export let margin = {};
  export let minWidth = 3;
  export let startDate = undefined;
  export let endDate = undefined;

  const chartWidth = getContext('width');
  const chartHeight = getContext('contentHeight');
  const offset = getContext('offset');

  $: _margin = {
    left: 40,
    top: 40,
    right: 40,
    bottom: 80,
    ...margin,
  };
  const DEFAULT_CATEGORY_VALUE = 'default';

  $: _grid = {
    colour: '#999',
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

  $: height = rowHeight * data.length;
  $: width = chartWidth - _margin.left - _margin.right;

  $: xDomain = data.map((d) => [d.start, d.end]).flat();
  $: yDomain = data.map((d, i) => i);

  $: xScale = scaleTime()
    .domain([startDate|| Math.min.apply(null, xDomain), endDate || Math.max.apply(null, xDomain)])
    .range([0, width])
    .nice();
  $: yScale = scaleBand()
    .domain(yDomain)
    .range([0, rowHeight * data.length])
    .padding(rowPadding);

  $: _overlay = overlay.filter(
    (o) =>
      o.date >= Math.min(...xScale.domain()) &&
      o.date <= Math.max(...xScale.domain())
  );

  $: bars = data.map((b, idx) => {
    const x = xScale(b.start);
    const y = yScale(idx);
    const width = Math.max(xScale(b.end) - xScale(b.start), minWidth);
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
  $: $chartHeight = height + calculatedTopMargin + _margin.bottom;

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
        start: xScale(data[i].start),
        end: xScale(data[i].end),
        category: data[i][categoryName],
      };
      let labelConfig;
      if (bar.end - bar.start - fontSize > label.getComputedTextLength()) {
        labelConfig = {
          x: bar.start + (bar.end - bar.start) / 2,
          textAnchor: 'middle',
          fill: _categoryColours[bar.category || DEFAULT_CATEGORY_VALUE].contrastColour,
          halo: colourScale(bar.category),
          dx: undefined,
        };
      } else if (bar.end + label.getComputedTextLength() + fontSize > width) {
        labelConfig = {
          x: bar.start,
          textAnchor: 'end',
          dx: -fontSize / 2,
          halo: _grid.background,
        };
      } else {
        labelConfig = {
          x: bar.end,
          dx: fontSize / 2,
          textAnchor: 'start',
          halo: _grid.background,
        };
      }
      labelPositions = [...labelPositions, labelConfig];
    }
  }

  /**
   * Automatically re-assigns legend item positioning based on longest item.
   */
  let legendEl;
  let legendMarkerPositions = [];

  function setLegendItemWidth() {
    if (!legendEl) return;
    const legendItems = Array.from(
      legendEl?.querySelectorAll('g').values() || []
    );
    legendMarkerPositions = [];
    const xGutter = 5;
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
    calculateLabelPositions();
    setLegendItemWidth();
  });
</script>

<g
  transform={`translate(${_margin.left}, ${calculatedTopMargin + $offset})`}
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
        vector-effect="non-scaling-stroke"
      />
      <text
        transform={`translate(0,${height + 5})`}
        text-anchor="middle"
        dominant-baseline="hanging"
        fill={_grid.colour}
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
      y={d.y}
      width={d.width}
      height={d.height}
      fill={d.colour}
      vector-effect="non-scaling-stroke"
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
        vector-effect="non-scaling-stroke"
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

  <g bind:this={labelsEl}>
    {#each data as d, idx}
      {@const labelConfig = labelPositions[idx]}
      <g transform={`translate(${labelConfig?.x || 0} ${yScale(idx)})`}>
        <text
          dx={labelConfig?.dx}
          dy={yScale.bandwidth() / 2}
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
    <g transform={`translate(0, ${height + 50})`} bind:this={legendEl}>
      <text>Legend:</text>
      {#each categories as cat, index}
        {@const thisCategory = _categoryColours[cat]}
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
          <text dx={fontSize * 1.5} fill={thisCategory.legendTextColour}
            >{thisCategory?.label || cat}</text
          >
        </g>
      {/each}
    </g>
  {/if}
</g>
