export function* choose(...options) {
  while(true) {
    yield options[Math.floor(Math.random() * options.length)]
  }
}
export function* cycle(...options) {
  let i = 0;
  while(true) {
    yield options[i % options.length];
    i++;
  }
}

export function randomDate(start, days) {
  return new Date(start.getTime() + Math.random() * days * 24 * 60 * 60 * 1000);
}

export function* randomDateSequence(from) {
  let start = randomDate(from, 30);
  while (true) {
    let end = randomDate(start, 365);
    yield {
      start: start.toISOString(),
      end: end.toISOString()
    }
    start = end;
  }
}

