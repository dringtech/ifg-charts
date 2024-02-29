import { differenceEuclideanRGB } from 'd3-color-difference';

/**
 * @param {string} base
 * @param {string[]} options
 */
export function contrastColour(base, ...options) {
  const _options = (options.length > 0) ? options : ['white', 'black'];

  const diffs = _options
    .map((o) => ({
      colour: o,
      difference: differenceEuclideanRGB(base, o),
    }))
    .sort((a, b) => a.difference - b.difference);

  return diffs.pop().colour;
}
