{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "1594ae83-1490-4be9-b0dc-3ad969fe8cd9",
    "created": "2026-01-25T20:43:13.454Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Shader Material - Uniforms Test",
    "description": "Tests all uniform types: float, int, bool, color, vec2, vec3, vec4, mat3, mat4"
  },
  "materials": {
    "mat_shader_48795eea": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform float uFloat;\nuniform int uInt;\nuniform bool uBool;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  vec3 color = vec3(uFloat, float(uInt) / 10.0, uBool ? 1.0 : 0.0);\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "uFloat": {
          "type": "float",
          "value": 0.8
        },
        "uInt": {
          "type": "int",
          "value": 5
        },
        "uBool": {
          "type": "bool",
          "value": true
        }
      }
    },
    "mat_shader_964e59b7": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FF6600"
        }
      }
    },
    "mat_shader_b8de11ef": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec2 uVec2;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  vec3 color = vec3(uVec2.x, uVec2.y, 0.5);\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "uVec2": {
          "type": "vec2",
          "value": [
            0.8,
            0.3
          ]
        }
      }
    },
    "mat_shader_e9d7d268": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uVec3;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uVec3 * light, 1.0);\n}",
      "uniforms": {
        "uVec3": {
          "type": "vec3",
          "value": [
            0.2,
            0.8,
            0.4
          ]
        }
      }
    },
    "mat_shader_46a90c2f": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec4 uVec4;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uVec4.rgb * light, uVec4.a);\n}",
      "uniforms": {
        "uVec4": {
          "type": "vec4",
          "value": [
            0.8,
            0.2,
            0.6,
            1
          ]
        }
      },
      "transparent": true
    },
    "mat_shader_7c917553": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform mat3 uMat3;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  vec3 baseColor = vec3(1.0, 0.5, 0.2);\n  vec3 color = uMat3 * baseColor;\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "uMat3": {
          "type": "mat3",
          "value": [
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1
          ]
        }
      }
    },
    "mat_shader_acca6860": {
      "type": "shader",
      "vertex": "uniform mat4 uMat4;\nvarying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  vec4 pos = uMat4 * vec4(position, 1.0);\n  gl_Position = projectionMatrix * modelViewMatrix * pos;\n}",
      "fragment": "varying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  vec3 color = vec3(0.6, 0.3, 0.9);\n  gl_FragColor = vec4(color * light, 1.0);\n}",
      "uniforms": {
        "uMat4": {
          "type": "mat4",
          "value": [
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
          ]
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
    "box": {
      "type": "box",
      "args": [
        1,
        1,
        1
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
    "cylinder": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ]
    }
  },
  "objects": [
    {
      "id": "6b51df10-0ed7-4a61-acc3-81a6260e7ec3",
      "name": "float_int_bool",
      "type": "sphere",
      "position": [
        -3,
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
      "material": "mat_shader_48795eea"
    },
    {
      "id": "a0b174f9-b24a-4841-adc6-d026400d1fed",
      "name": "color_uniform",
      "type": "sphere",
      "position": [
        0,
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
      "material": "mat_shader_964e59b7"
    },
    {
      "id": "1e670c9f-5428-4d03-8f29-edca1f6ea4e0",
      "name": "vec2_uniform",
      "type": "sphere",
      "position": [
        3,
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
      "material": "mat_shader_b8de11ef"
    },
    {
      "id": "2bd2a33d-657b-4b6b-b824-f23f0078ce52",
      "name": "vec3_uniform",
      "type": "box",
      "position": [
        -3,
        0.5,
        3
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
      "material": "mat_shader_e9d7d268"
    },
    {
      "id": "bfc568a1-4158-41c1-b3ad-116d94ad6515",
      "name": "vec4_uniform",
      "type": "box",
      "position": [
        0,
        0.5,
        3
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
      "material": "mat_shader_46a90c2f"
    },
    {
      "id": "03cd74a1-c550-4f22-9eae-98c207e17930",
      "name": "mat3_uniform",
      "type": "torus",
      "position": [
        3,
        0.5,
        3
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
      "material": "mat_shader_7c917553"
    },
    {
      "id": "4055360d-e232-434a-bba8-8b9312639988",
      "name": "mat4_uniform",
      "type": "cylinder",
      "position": [
        0,
        0.5,
        -3
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
      "geometry": "cylinder",
      "material": "mat_shader_acca6860"
    }
  ],
  "roots": [
    "6b51df10-0ed7-4a61-acc3-81a6260e7ec3",
    "a0b174f9-b24a-4841-adc6-d026400d1fed",
    "1e670c9f-5428-4d03-8f29-edca1f6ea4e0",
    "2bd2a33d-657b-4b6b-b824-f23f0078ce52",
    "bfc568a1-4158-41c1-b3ad-116d94ad6515",
    "03cd74a1-c550-4f22-9eae-98c207e17930",
    "4055360d-e232-434a-bba8-8b9312639988"
  ]
}