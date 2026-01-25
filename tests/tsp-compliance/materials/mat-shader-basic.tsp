{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "14f8fd74-6235-4318-876f-1f60092618dc",
    "created": "2026-01-25T20:38:56.819Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Shader Material - Basic Test",
    "description": "Tests basic shader material with simple color uniform"
  },
  "materials": {
    "mat_shader_cf65f9df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FF0000"
        }
      }
    },
    "mat_shader_789e79df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#00FF00"
        }
      }
    },
    "mat_shader_79b6f9df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#0000FF"
        }
      }
    },
    "mat_shader_ced998df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FF8800"
        }
      }
    },
    "mat_shader_248e58df": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 1.0);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#8800FF"
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
    }
  },
  "objects": [
    {
      "id": "bbc719c1-bab9-44a0-a941-088bfe9e678a",
      "name": "shader_red",
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
      "material": "mat_shader_cf65f9df"
    },
    {
      "id": "563e8b06-a48a-47c1-b1c4-38d46aa2b76d",
      "name": "shader_green",
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
      "material": "mat_shader_789e79df"
    },
    {
      "id": "bf3ab740-764e-4414-88b8-25fb81fe40ff",
      "name": "shader_blue",
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
      "material": "mat_shader_79b6f9df"
    },
    {
      "id": "13920d6f-47e5-4ed5-a301-3a7ea956150a",
      "name": "shader_box",
      "type": "box",
      "position": [
        -1.5,
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
      "material": "mat_shader_ced998df"
    },
    {
      "id": "7ab8cc05-42f3-426a-b884-db91339608ed",
      "name": "shader_torus",
      "type": "torus",
      "position": [
        1.5,
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
      "material": "mat_shader_248e58df"
    }
  ],
  "roots": [
    "bbc719c1-bab9-44a0-a941-088bfe9e678a",
    "563e8b06-a48a-47c1-b1c4-38d46aa2b76d",
    "bf3ab740-764e-4414-88b8-25fb81fe40ff",
    "13920d6f-47e5-4ed5-a301-3a7ea956150a",
    "7ab8cc05-42f3-426a-b884-db91339608ed"
  ]
}