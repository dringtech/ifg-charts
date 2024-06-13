import { timeline } from './dist/ifg-charts.es.js';
import { documentationExample, options } from './test.js';

timeline("timeline-chart", documentationExample);
timeline("timeline-chart-full", options);

const docExample = document.getElementById('documented-example');
docExample.innerHTML = JSON.stringify(documentationExample, null, 2);

hljs.highlightAll();
