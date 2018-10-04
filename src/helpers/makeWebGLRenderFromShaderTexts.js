/** シェーダを作る処理です */
function createOneShader(gl, type, text) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, text);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = new Error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw err;
  }
  return shader;
}

/**
 * @param {{ vert: string; frag: string }} shaders
 * @returns {Function}
 */
const makeWebGLRenderFromShaderTexts = (shaders) => async (canvas, imageBitmap) => {
  const gl = canvas.getContext('webgl');
  const vertShader = createOneShader(gl, gl.VERTEX_SHADER, shaders.vert);
  const fragShader = createOneShader(gl, gl.FRAGMENT_SHADER, shaders.frag);

  /** Program に Shader を紐づけます */
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const err = new Error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw err;
  }
  gl.useProgram(program);

  /** テクスチャの設定をします */
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  /** 範囲外のテクスチャをどう処理するか */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  /** テクスチャの補完方法 */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  /** ImageBitmap を設定する */
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);
  /** ビューポートの設定 */
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  /** 初期化 */
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /** 0.0 - 1.0 に正規化したテクスチャ座標 */
  const texCoordAttrLoc = gl.getAttribLocation(program, 'a_texCoord');
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // TriangleA
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      // TriangleB
      0.0, 1.0,
      1.0, 0.0, 
      1.0, 1.0
    ]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(texCoordAttrLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordAttrLoc, 2, gl.FLOAT, false, 0, 0);

  /** 三角形を描画する */
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

export default makeWebGLRenderFromShaderTexts;
