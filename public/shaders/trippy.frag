uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float colorSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // Create flowing color bands based on position and time
  float angle = atan(vPosition.z, vPosition.x);
  float radius = length(vPosition.xz);

  // Psychedelic spiral pattern
  float spiral = angle * 3.0 + vPosition.y * 4.0 + time * colorSpeed;
  float wave = sin(spiral) * 0.5 + 0.5;

  // Rainbow hue shift based on displacement and position
  float hue = fract(
    vDisplacement * 2.0 +
    vPosition.y * 0.5 +
    time * 0.1 +
    sin(angle * 3.0 + time) * 0.2
  );

  // Saturation varies with displacement
  float sat = 0.7 + sin(vDisplacement * 10.0 + time) * 0.3;

  // Value/brightness pulses
  float val = 0.8 + sin(time * 2.0 + vPosition.y * 5.0) * 0.2;

  // Base rainbow color
  vec3 rainbow = hsv2rgb(vec3(hue, sat, val));

  // Mix with user colors based on wave patterns
  float mix1 = sin(spiral * 0.5) * 0.5 + 0.5;
  float mix2 = cos(spiral * 0.7 + 1.0) * 0.5 + 0.5;

  vec3 colorMix = mix(color1, color2, mix1);
  colorMix = mix(colorMix, color3, mix2 * 0.5);

  // Blend rainbow with color mix
  vec3 finalColor = mix(rainbow, colorMix, 0.4);

  // Add glow based on displacement peaks
  float glow = smoothstep(0.0, 0.3, abs(vDisplacement)) * 0.3;
  finalColor += glow;

  // Fresnel-like edge glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
  finalColor += fresnel * 0.3 * rainbow;

  gl_FragColor = vec4(finalColor, 1.0);
}
