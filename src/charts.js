import Timeline from './Timeline.svelte'

export function timeline(
  targetId,
  options
) {
  const app = new Timeline({
    target: document.getElementById(targetId),
    props: options
  })
}
