<script>
  import { getContext } from 'svelte';

  export let barHeight = 43.4;
  export let title = [];

  const width = getContext('width');
  const lineSpacing = 1.1;

  $: fontSize = 1 / (title.length + 1);
  $: titleOffset = (1 - (fontSize * title.length * lineSpacing)) / 2;
</script>

<g>
  <rect {width} height={ barHeight } fill="#001e62" />
  <text
      fill="#ffffff"
      font-size={ fontSize }
      transform={ `scale(${ barHeight }) translate(0.3 ${ titleOffset })` }
      font-weight='bold'
      dominant-baseline='hanging'
    >
    {#each title as line, idx (idx) }
    <tspan x=0 y={ idx * fontSize * lineSpacing }>
      { line }
    </tspan>
    {/each}
  </text>

  <g transform={ `translate(${width - barHeight * 2 })` }>
    <!-- 12.8 -->
    <defs>
      <linearGradient id="flash" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#00A8E1" />
        <stop offset="100%" stop-color="#84329B" />
      </linearGradient>
    </defs>
    <path
      transform={`scale(${barHeight})`}
      d={`m0,0 h0.3 L1,1 h-0.3 z`}
      fill="url(#flash)"
    />
    <g transform={ `scale(${ barHeight / 43.4 }) translate(45 12)`}>
      <path
        d="m 0,0 c 0.6,-0.1 1.2,-0.1 1.8,-0.1 0.6,0 1.2,0 1.8,0.1 v 17.8 c -0.6,0.1 -1.2,0.2 -1.8,0.2 -0.6,0 -1.2,-0.1 -1.8,-0.2 z"
        fill="#ffffff"
      />
      <path
        d="m 8.1,7.7 h -2 c 0,-0.3 -0.1,-0.5 -0.1,-0.7 0,-0.2 0,-0.4 0,-0.7 0,-0.2 0,-0.4 0,-0.6 0,-0.2 0,-0.4 0.1,-0.7 h 2 v -0.6 c 0,-0.8 0.1,-1.5 0.4,-2.1 0.2,-0.6 0.6,-1.1 1,-1.6 0.4,-0.4 1,-0.7 1.6,-1 0.6,-0.2 1.3,-0.3 2,-0.3 0.5,0 0.9,0 1.3,0.1 0.3,0 0.7,0.1 1.1,0.2 0,0.5 -0.1,1 -0.2,1.5 -0.1,0.4 -0.2,0.9 -0.4,1.3 -0.2,0 -0.4,-0.1 -0.6,-0.1 -0.2,0 -0.5,-0.1 -0.8,-0.1 -0.6,0 -1.1,0.1 -1.4,0.4 -0.4,0.3 -0.6,0.9 -0.6,1.7 v 0.5 h 3 c 0.1,0.3 0.1,0.5 0.1,0.7 0,0.2 0,0.4 0,0.7 0,0.2 0,0.4 0,0.6 0,0.2 0,0.4 -0.1,0.7 h -3 v 10.1 c -0.6,0.1 -1.2,0.2 -1.7,0.2 -0.6,0 -1.2,0 -1.8,-0.2 z"
        fill="#ffffff"
      />
      <path
        d="m 27,8.6 c 0.6,-0.1 1.2,-0.1 1.8,-0.1 0.6,0 1.2,0.1 1.8,0.1 v 8.7 c -0.9,0.3 -1.7,0.5 -2.7,0.6 -0.9,0.1 -1.7,0.2 -2.4,0.2 -1.5,0 -2.7,-0.2 -3.8,-0.7 -1.1,-0.5 -2,-1.1 -2.7,-1.9 -0.7,-0.8 -1.3,-1.8 -1.6,-2.9 -0.4,-1.1 -0.5,-2.3 -0.5,-3.7 0,-1.3 0.2,-2.5 0.6,-3.7 0.4,-1.1 0.9,-2.1 1.6,-2.9 0.7,-0.8 1.6,-1.5 2.6,-1.9 1,-0.5 2.2,-0.7 3.6,-0.7 0.8,0 1.5,0.1 2.2,0.2 0.7,0.1 1.4,0.3 2.1,0.6 0,0.5 -0.1,1 -0.3,1.4 -0.2,0.5 -0.3,0.9 -0.5,1.4 -0.6,-0.2 -1.1,-0.3 -1.5,-0.4 -0.4,-0.1 -1,-0.1 -1.6,-0.1 -1.6,0 -2.8,0.5 -3.6,1.5 -0.8,1 -1.3,2.6 -1.3,4.6 0,2 0.4,3.5 1.3,4.5 0.8,1 2.1,1.5 3.7,1.5 0.3,0 0.5,0 0.8,-0.1 0.2,0 0.4,-0.1 0.6,-0.1 z"
        fill="#ffffff"
      />
    </g>
  </g>
</g>
