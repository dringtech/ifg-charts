import Timeline from './Timeline.svelte'
import { categoryColours } from "./lib/categoryColours.js"

export function timeline(
  targetId,
  options
) {
  const instance = new Timeline({
    target: document.getElementById(targetId),
    props: options
  })
  return instance;
}

export {
  categoryColours
};