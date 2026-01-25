{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "6187078b-6d70-4b9a-9302-2520218018a1",
    "created": "2026-01-25T20:15:59.282Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "mat-standard-transparent",
    "description": "Standard material test: opacity and transparent flag"
  },
  "materials": {
    "mat_56605b21": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_daf3fdcb": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "opacity": 0.75,
      "transparent": true
    },
    "mat_41c230fc": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "opacity": 0.5,
      "transparent": true
    },
    "mat_e454e9ce": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "opacity": 0.25,
      "transparent": true
    },
    "mat_4d7d37fd": {
      "color": "#ff6b35",
      "metalness": 0.1,
      "roughness": 0.8
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
    }
  },
  "objects": [
    {
      "id": "68ac8071-35d2-4b94-9e22-b11c6360e4f3",
      "name": "opaque",
      "type": "sphere",
      "position": [
        -3,
        0,
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
      "material": "mat_56605b21"
    },
    {
      "id": "922494ec-ee5e-4b00-b284-7d02c1e59292",
      "name": "transparent_75",
      "type": "sphere",
      "position": [
        -1,
        0,
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
      "material": "mat_daf3fdcb"
    },
    {
      "id": "e9070b92-3f5c-4e24-b0bf-307732dcf5fe",
      "name": "transparent_50",
      "type": "sphere",
      "position": [
        1,
        0,
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
      "material": "mat_41c230fc"
    },
    {
      "id": "ce605c9a-e322-4f9b-8c43-1f28007460a1",
      "name": "transparent_25",
      "type": "sphere",
      "position": [
        3,
        0,
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
      "material": "mat_e454e9ce"
    },
    {
      "id": "5e3d8ac6-493d-4be2-b4a1-e46770bed433",
      "name": "backdrop_box",
      "type": "box",
      "position": [
        0,
        0,
        -1
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        8,
        3,
        0.2
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_4d7d37fd"
    }
  ],
  "roots": [
    "68ac8071-35d2-4b94-9e22-b11c6360e4f3",
    "922494ec-ee5e-4b00-b284-7d02c1e59292",
    "e9070b92-3f5c-4e24-b0bf-307732dcf5fe",
    "ce605c9a-e322-4f9b-8c43-1f28007460a1",
    "5e3d8ac6-493d-4be2-b4a1-e46770bed433"
  ]
}