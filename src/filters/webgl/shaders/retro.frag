// Based on Filterous under the MIT License
// Copyright (c) 2017 Tomomi Imura

precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texCoord;

vec4 colorFilter(vec4 color, vec3 rgb, float adj) {
  return vec4(
    (1.0 - adj) * color.rgb + rgb * adj,
    color.a
  );
}

vec4 saturation(vec4 color, float s) {
  vec3 sr = vec3((1.0 - s) * 0.3086);
  vec3 sg = vec3((1.0 - s) * 0.6094);
  vec3 sb = vec3((1.0 - s) * 0.0820);
  return vec4(
    (mat3(sr, sg, sb) + mat3(s)) * color.rgb,
    color.a
  );
}

vec4 contrast(vec4 color, float c) {
  return vec4(
    color.rgb * vec3(c) + (1.0 - c) / 2.0,
    color.a
  );
}

void main() {
  vec4 color = texture2D(u_image, v_texCoord);
  color = colorFilter(color, vec3(1.0, 1.0, 0), 0.07);
  color = saturation(color, 1.2);
  color = contrast(color, 1.15);
	
  gl_FragColor = color;
}
