<script>
  import { setContext } from 'svelte';
  import { writable, derived } from 'svelte/store';
  export let width = 800;
  export let minHeight = 300;
  export let opts = {};

  const contentHeight = writable(minHeight);
  const viewHeight = derived(
    contentHeight,
    ($contentHeight) => Math.max($contentHeight, minHeight
  ))
  setContext('width', width);
  setContext('height', contentHeight);
  $: offset = ($viewHeight - $contentHeight) / 2;
</script>

<svg viewBox={`0 ${ -offset } ${width} ${$viewHeight}`} { ...opts }>
  <slot></slot>
</svg>