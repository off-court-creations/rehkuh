// Basic fragment shader template
uniform vec3 baseColor;
uniform float time;

varying vec3 vWorldPosition;
varying vec2 vUv;

// Simple noise function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 pos = vWorldPosition.xz * 0.5;
  float n = noise(pos + time * 0.1);
  vec3 color = baseColor * (0.8 + 0.4 * n);
  gl_FragColor = vec4(color, 1.0);
}
