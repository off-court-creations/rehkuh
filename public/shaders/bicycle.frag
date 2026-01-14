// Bicycle shader - fragment
// Draws a red bicycle silhouette using signed distance functions

uniform vec3 bikeColor;
uniform vec3 bgColor;

varying vec2 vUv;

// SDF for a circle
float sdCircle(vec2 p, vec2 center, float radius) {
  return length(p - center) - radius;
}

// SDF for a line segment
float sdSegment(vec2 p, vec2 a, vec2 b, float thickness) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - thickness;
}

// SDF for a ring (wheel)
float sdRing(vec2 p, vec2 center, float radius, float thickness) {
  return abs(length(p - center) - radius) - thickness;
}

void main() {
  // Center and scale UV coordinates
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= 1.5; // Stretch horizontally for bike proportions

  // Wheel parameters
  float wheelRadius = 0.35;
  float wheelThickness = 0.025;
  float spokeThickness = 0.012;
  float frameThickness = 0.025;

  // Wheel positions
  vec2 backWheel = vec2(-0.5, -0.2);
  vec2 frontWheel = vec2(0.5, -0.2);

  // Frame key points
  vec2 seatPost = vec2(-0.15, 0.3);
  vec2 bottomBracket = vec2(0.0, -0.15);
  vec2 headTube = vec2(0.35, 0.25);
  vec2 handlebar = vec2(0.45, 0.45);
  vec2 seat = vec2(-0.25, 0.4);

  float d = 1000.0;

  // Back wheel rim
  d = min(d, sdRing(uv, backWheel, wheelRadius, wheelThickness));

  // Front wheel rim
  d = min(d, sdRing(uv, frontWheel, wheelRadius, wheelThickness));

  // Back wheel hub
  d = min(d, sdCircle(uv, backWheel, 0.03));

  // Front wheel hub
  d = min(d, sdCircle(uv, frontWheel, 0.03));

  // Back wheel spokes (4 spokes)
  for (int i = 0; i < 4; i++) {
    float angle = float(i) * 3.14159 / 2.0;
    vec2 spokeEnd = backWheel + vec2(cos(angle), sin(angle)) * (wheelRadius - 0.01);
    d = min(d, sdSegment(uv, backWheel, spokeEnd, spokeThickness));
  }

  // Front wheel spokes (4 spokes)
  for (int i = 0; i < 4; i++) {
    float angle = float(i) * 3.14159 / 2.0 + 0.4;
    vec2 spokeEnd = frontWheel + vec2(cos(angle), sin(angle)) * (wheelRadius - 0.01);
    d = min(d, sdSegment(uv, frontWheel, spokeEnd, spokeThickness));
  }

  // Frame - seat tube (seat post to bottom bracket)
  d = min(d, sdSegment(uv, seatPost, bottomBracket, frameThickness));

  // Frame - down tube (head tube to bottom bracket)
  d = min(d, sdSegment(uv, headTube, bottomBracket, frameThickness));

  // Frame - top tube (seat post to head tube)
  d = min(d, sdSegment(uv, seatPost, headTube, frameThickness));

  // Frame - chain stay (back wheel to bottom bracket)
  d = min(d, sdSegment(uv, backWheel, bottomBracket, frameThickness * 0.7));

  // Frame - seat stay (back wheel to seat post)
  d = min(d, sdSegment(uv, backWheel, seatPost, frameThickness * 0.6));

  // Fork (front wheel to head tube)
  d = min(d, sdSegment(uv, frontWheel, headTube, frameThickness * 0.7));

  // Handlebar stem
  d = min(d, sdSegment(uv, headTube, handlebar, frameThickness * 0.6));

  // Handlebar
  d = min(d, sdSegment(uv, handlebar + vec2(-0.1, 0.0), handlebar + vec2(0.08, -0.05), frameThickness * 0.5));

  // Seat
  d = min(d, sdSegment(uv, seat + vec2(-0.08, 0.0), seat + vec2(0.12, 0.0), frameThickness * 1.2));
  d = min(d, sdSegment(uv, seatPost, seat, frameThickness * 0.5));

  // Pedal crank
  d = min(d, sdCircle(uv, bottomBracket, 0.04));
  d = min(d, sdSegment(uv, bottomBracket, bottomBracket + vec2(0.08, -0.06), frameThickness * 0.4));
  d = min(d, sdSegment(uv, bottomBracket, bottomBracket + vec2(-0.08, 0.06), frameThickness * 0.4));

  // Smooth edge
  float edge = smoothstep(0.01, -0.01, d);

  // Mix colors
  vec3 color = mix(bgColor, bikeColor, edge);

  gl_FragColor = vec4(color, 1.0);
}
