import * as filters from './filters';

self.addEventListener('message', async ({ data: { filterName, canvas, imageBitmap } }) => {
  try {
    if (!filters[filterName]) {
      return self.postMessage({ status: 'not_found' });
    }
    const ctx = await filters[filterName](canvas, imageBitmap);
    if (ctx.commit) {
      ctx.commit();
    } else if ('requestAnimationFrame' in self) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return self.postMessage({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return self.postMessage({ error: err.message });
  }
});
