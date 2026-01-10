// Heart noise fragment shader
uniform vec3 baseColor;
uniform vec3 accentColor;
uniform float time;

varying vec3 vWorldPosition;
varying vec2 vUv;

// Simple noise functions
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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Animated noise based on UV and time
  vec2 pos = vUv * 3.0 + time * 0.2;
  float n = fbm(pos);

  // Boost contrast - remap from [0.3, 0.7] to [0, 1]
  n = smoothstep(0.25, 0.75, n);

  // Add secondary layer for more detail
  float detail = noise(vUv * 8.0 - time * 0.5) * 0.3;
  n = clamp(n + detail, 0.0, 1.0);

  // Pulsing effect
  float pulse = sin(time * 2.0) * 0.5 + 0.5;
  n = n * (0.6 + 0.4 * pulse);

  // Mix between dark and light with more range
  vec3 darkColor = baseColor * 0.4;
  vec3 lightColor = accentColor * 1.4;
  vec3 color = mix(darkColor, lightColor, n);

  // Add highlights
  float highlight = pow(n, 3.0) * 0.3;
  color += highlight;

  gl_FragColor = vec4(color, 1.0);
}
