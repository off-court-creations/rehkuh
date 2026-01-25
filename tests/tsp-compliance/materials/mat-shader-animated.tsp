{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "1ccb6a8b-1842-415a-a3de-0e2f8266b28c",
    "created": "2026-01-25T20:40:25.539Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Shader Material - Animated Test",
    "description": "Tests time-based animation with animated uniform flag"
  },
  "materials": {
    "mat_shader_6333855c": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform float time;\nvarying vec3 vNormal;\nvoid main() {\n  float pulse = sin(time * 2.0) * 0.5 + 0.5;\n  vec3 color = mix(vec3(0.2, 0.0, 0.4), vec3(1.0, 0.0, 0.8), pulse);\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "time": {
          "animated": true,
          "type": "float",
          "value": 0
        }
      }
    },
    "mat_shader_ce0d069d": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvarying vec3 vPosition;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform float time;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvoid main() {\n  float hue = fract(vPosition.x * 0.5 + time * 0.3);\n  vec3 color = abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0;\n  color = clamp(color, 0.0, 1.0);\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "time": {
          "animated": true,
          "type": "float",
          "value": 0
        }
      }
    },
    "mat_shader_5c0a612a": {
      "type": "shader",
      "vertex": "uniform float time;\nvarying vec3 vNormal;\nvoid main() {\n  vec3 pos = position;\n  pos.y += sin(pos.x * 3.0 + time * 2.0) * 0.1;\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
      "fragment": "uniform float time;\nvarying vec3 vNormal;\nvoid main() {\n  vec3 color = vec3(0.2, 0.6, 1.0);\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "time": {
          "animated": true,
          "type": "float",
          "value": 0
        }
      }
    },
    "mat_shader_240218df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#888888"
        }
      }
    }
  },
  "geometries": {
    "sphere": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ]
    },
    "torus": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ]
    },
    "box": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ]
    }
  },
  "objects": [
    {
      "id": "727d7a0c-7162-4cca-a474-7f3f1240cfd9",
      "name": "pulse_sphere",
      "type": "sphere",
      "position": [
        -2.5,
        0.5,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_shader_6333855c"
    },
    {
      "id": "b988adb2-a69b-4503-aa33-83e047d93c08",
      "name": "rainbow_torus",
      "type": "torus",
      "position": [
        0,
        0.5,
        0
      ],
      "rotation": [
        0.5,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "torus",
      "material": "mat_shader_ce0d069d"
    },
    {
      "id": "cb62955f-f9ce-49e9-9e3d-1b615efc3cbd",
      "name": "wave_box",
      "type": "box",
      "position": [
        2.5,
        0.5,
        0
      ],
      "rotation": [
        0,
        0.5,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_shader_5c0a612a"
    },
    {
      "id": "7a461e3b-41fd-4827-b6e2-460b007bf430",
      "name": "static_reference",
      "type": "sphere",
      "position": [
        0,
        0.5,
        3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_shader_240218df"
    }
  ],
  "roots": [
    "727d7a0c-7162-4cca-a474-7f3f1240cfd9",
    "b988adb2-a69b-4503-aa33-83e047d93c08",
    "cb62955f-f9ce-49e9-9e3d-1b615efc3cbd",
    "7a461e3b-41fd-4827-b6e2-460b007bf430"
  ]
}