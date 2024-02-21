<script context="module">
  import { toPng } from 'dom-to-image-more';

  let wrapper;

  const downloadLink = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename
    link.href = dataUrl;
    link.click();
  }

  export function exportSVG() {
    const svg = wrapper.querySelector('svg')
    const serializer = new XMLSerializer();
    // TODO add styles - defs entry?
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    const dataUrl = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    downloadLink(dataUrl, 'chart.svg');
  }

  export async function exportPNG() {
    let dataUrl;
    try {
      dataUrl = await toPng(wrapper);
    } catch(e) {
      console.error('Failed to render PNG', e);
    }
    downloadLink(dataUrl, 'chart.png');
  }
</script>

<div bind:this={ wrapper }><slot/></div>