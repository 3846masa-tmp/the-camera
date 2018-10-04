attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
  v_texCoord = a_texCoord;
  // X: [0, 1.0] -> [-1.0, 1.0]
  // Y: [0, 1.0] -> [1.0, -1.0]
  gl_Position = vec4((a_texCoord * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);
}
