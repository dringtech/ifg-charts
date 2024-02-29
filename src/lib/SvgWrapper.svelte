<script>
  export let width = 800;
  export let height = 400;
  export let opts = {};
</script>

<svg viewBox={`0 0 ${width} ${height}`} { ...opts }>
  <slot></slot>
</svg>