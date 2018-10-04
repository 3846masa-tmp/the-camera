import wrapFilter from '~/helpers/wrapFilter';

import _grayScale from '~/filters/purejs/grayScale';
import _retro from '~/filters/webgl/retro';
import wasm from '~/filters/wasm';

export const grayScale = wrapFilter(_grayScale);
export const retro = wrapFilter(_retro);
export const ink = wrapFilter(wasm.posterize);
