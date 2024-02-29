import { differenceEuclideanRGB } from 'd3-color-difference';

/**
 * @param {string} a
 * @param {string} b
 */
function colourDifference(a, b) {
  return differenceEuclideanRGB(a, b);
}

export function highContrast(a, b, clip=200) {
  return colourDifference(a, b) > clip;
}

/**
 * @param {string} base
 * @param {string[]} options
 */
export function contrastColour(base, ...options) {
  const _options = (options.length > 0) ? options : ['white', 'black'];

  const diffs = _options
    .map((o) => ({
      colour: o,
      difference: colourDifference(base, o),
    }))
    .sort((a, b) => a.difference - b.difference);

  return diffs.pop().colour;
}
