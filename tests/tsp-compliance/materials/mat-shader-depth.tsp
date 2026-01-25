{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "7c00f35b-54fe-4cc1-b7cd-c618b78f8164",
    "created": "2026-01-25T20:46:57.133Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Shader Material - Depth Test",
    "description": "Tests depthWrite and depthTest combinations"
  },
  "materials": {
    "mat_b01db59d": {
      "color": "#FF4444",
      "metalness": 0,
      "roughness": 0.5
    },
    "mat_shader_7640f499": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.7);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#4444FF"
        }
      },
      "transparent": true
    },
    "mat_shader_7e329499": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.7);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#44FF44"
        }
      },
      "transparent": true,
      "depthWrite": false
    },
    "mat_shader_50ffb319": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.7);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FFFF44"
        }
      },
      "transparent": true,
      "depthTest": false
    },
    "mat_shader_490e1319": {
      "type": "shader",
      "vertex": "varying vec3 vNormal;\nvoid main() {\n  vNormal = normalize(normalMatrix * normal);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
      "fragment": "uniform vec3 uColor;\nvarying vec3 vNormal;\nvoid main() {\n  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;\n  gl_FragColor = vec4(uColor * light, 0.7);\n}",
      "uniforms": {
        "uColor": {
          "type": "color",
          "value": "#FF44FF"
        }
      },
      "transparent": true,
      "depthWrite": false,
      "depthTest": false
    },
    "mat_b786775d": {
      "color": "#44FFFF",
      "metalness": 0,
      "roughness": 0.5
    }
  },
  "geometries": {
    "box": {
      "type": "box",
      "args": [
        1,
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
    }
  },
  "objects": [
    {
      "id": "c1190186-4861-4070-9fba-018a61a109ea",
      "name": "reference_back",
      "type": "box",
      "position": [
        0,
        0.5,
        -1
      ],
      "rotation": [
        0,
        0.3,
        0
      ],
      "scale": [
        4,
        1,
        0.2
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_b01db59d"
    },
    {
      "id": "4baf1f8f-66e1-4d1d-9dfb-2963e49a16ec",
      "name": "depth_default",
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
      "material": "mat_shader_7640f499"
    },
    {
      "id": "59260e5f-2b68-4818-a184-98bd7bb75654",
      "name": "depth_write_false",
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
      "material": "mat_shader_7e329499"
    },
    {
      "id": "c80c0ae1-af22-473d-9c57-2a86f0cf6b85",
      "name": "depth_test_false",
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
      "material": "mat_shader_50ffb319"
    },
    {
      "id": "8296caee-0a41-45eb-927d-672158c6d1ac",
      "name": "depth_both_false",
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
      "material": "mat_shader_490e1319"
    },
    {
      "id": "20b5a690-61d5-4987-a036-9b7a00b308b9",
      "name": "reference_front",
      "type": "box",
      "position": [
        0,
        0.5,
        1.5
      ],
      "rotation": [
        0,
        -0.3,
        0
      ],
      "scale": [
        3,
        0.5,
        0.2
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_b786775d"
    }
  ],
  "roots": [
    "c1190186-4861-4070-9fba-018a61a109ea",
    "4baf1f8f-66e1-4d1d-9dfb-2963e49a16ec",
    "59260e5f-2b68-4818-a184-98bd7bb75654",
    "c80c0ae1-af22-473d-9c57-2a86f0cf6b85",
    "8296caee-0a41-45eb-927d-672158c6d1ac",
    "20b5a690-61d5-4987-a036-9b7a00b308b9"
  ]
}