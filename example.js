import { timeline } from './dist/ifg-charts.es.js';
import { documentationExample } from './test.js';
timeline("timeline-chart", documentationExample);

const docExample = document.getElementById('documented-example');
docExample.innerHTML = JSON.stringify(documentationExample, null, 2);

hljs.highlightAll();
