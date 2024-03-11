<script>
  import { setContext } from 'svelte';
  import { readable, writable, derived } from 'svelte/store';
  export let width = 800;
  export let minHeight = 300;
  export let opts = {};
  export let style;

  const contentHeight = writable(minHeight);
  const viewHeight = derived(
    contentHeight,
    ($contentHeight) => Math.max($contentHeight, minHeight)
  )
  setContext('width', width);
  setContext('contentHeight', contentHeight);
  setContext('height', viewHeight);

  const offset = derived([ contentHeight, viewHeight ],
    ([$contentHeight, $viewHeight]) => ($viewHeight - $contentHeight) / 2
  )
  setContext('offset', offset);
  // (($viewHeight - $contentHeight) / 2);
  // $: setContext('offset', );
</script>

<svg viewBox={`0 0 ${width} ${$viewHeight}`} { ...opts }>
  {#if style}{@html `<style>${ style }</style>`}{/if}
  <slot></slot>
</svg>