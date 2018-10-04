import makeWebGLRenderFromShaderTexts from '~/helpers/makeWebGLRenderFromShaderTexts';

import vert from './shaders/default.vert';
import frag from './shaders/retro.frag';

export default makeWebGLRenderFromShaderTexts({
  vert,
  frag,
});
