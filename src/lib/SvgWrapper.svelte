<script>
  import { setContext } from 'svelte';
  import { derived, writable } from 'svelte/store';
  export let width = 800;
  export let height = 0;
  export let opts = {};
  export let style;

  let heightStore = writable(height);
  $: $heightStore = height;

  setContext('width', width);
  setContext('height', derived(heightStore, $s => $s));
</script>

<svg viewBox={`0 0 ${width} ${$heightStore || 0}`} { ...opts }>
  {#if style}{@html `<style>${ style }</style>`}{/if}
  <slot></slot>
</svg>