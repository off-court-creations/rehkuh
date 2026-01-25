{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "bf57cdf7-f29d-4227-bbac-6f75107bfe9c",
    "created": "2026-01-25T20:45:18.828Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Shader Material - Blending Test",
    "description": "Tests all blend modes: normal, additive, subtractive, multiply"
  },
  "materials": {
    "mat_507d9787": {
      "color": "#444488",
      "metalness": 0,
      "roughness": 1
    },
    "mat_shader_2a782bdb": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.5);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FF0000"
        }
      },
      "transparent": true,
      "blending": "normal"
    },
    "mat_shader_7f146bdb": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.5);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#00FF00"
        }
      },
      "transparent": true,
      "blending": "additive"
    },
    "mat_shader_7fa0abdb": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.5);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#0000FF"
        }
      },
      "transparent": true,
      "blending": "subtractive"
    },
    "mat_shader_29ebcadb": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.5);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FFFF00"
        }
      },
      "transparent": true,
      "blending": "multiply"
    },
    "mat_9c01b91d": {
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0.5
    }
  },
  "geometries": {
    "plane": {
      "type": "plane",
      "args": [
        1,
        1
      ]
    },
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
    }
  },
  "objects": [
    {
      "id": "45fe2688-918d-4cd4-a979-9588875ce78e",
      "name": "background_plane",
      "type": "plane",
      "position": [
        0,
        0,
        -2
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        12,
        8,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane",
      "material": "mat_507d9787"
    },
    {
      "id": "595ccfec-f11d-4ade-bac4-9e201c599c71",
      "name": "blend_normal",
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
      "material": "mat_shader_2a782bdb"
    },
    {
      "id": "f948a3b2-d14e-4bca-be77-66df01b98ca4",
      "name": "blend_additive",
      "type": "sphere",
      "position": [
        -1,
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
      "material": "mat_shader_7f146bdb"
    },
    {
      "id": "a8b7bd7f-d57a-461d-9f4d-b257bf561b41",
      "name": "blend_subtractive",
      "type": "sphere",
      "position": [
        1,
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
      "material": "mat_shader_7fa0abdb"
    },
    {
      "id": "680ae772-61a9-432f-9ee6-6e05a181dd9b",
      "name": "blend_multiply",
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
      "material": "mat_shader_29ebcadb"
    },
    {
      "id": "dbe88aaa-edac-4880-ab90-e96d0470da0a",
      "name": "solid_reference",
      "type": "box",
      "position": [
        0,
        0.5,
        2
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
      "material": "mat_9c01b91d"
    }
  ],
  "roots": [
    "45fe2688-918d-4cd4-a979-9588875ce78e",
    "595ccfec-f11d-4ade-bac4-9e201c599c71",
    "f948a3b2-d14e-4bca-be77-66df01b98ca4",
    "a8b7bd7f-d57a-461d-9f4d-b257bf561b41",
    "680ae772-61a9-432f-9ee6-6e05a181dd9b",
    "dbe88aaa-edac-4880-ab90-e96d0470da0a"
  ]
}