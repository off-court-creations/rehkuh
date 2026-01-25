{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "11f11675-abae-4505-895a-df038df12da9",
    "created": "2026-01-25T20:14:46.184Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "mat-standard-emissive",
    "description": "Standard material test: emissive color + intensity"
  },
  "materials": {
    "mat_56605b21": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_35b9c08e": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#4a90d9",
      "emissiveIntensity": 0.3
    },
    "mat_35b9c08a": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#4a90d9",
      "emissiveIntensity": 0.7
    },
    "mat_6f3dc2d2": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#4a90d9",
      "emissiveIntensity": 1
    },
    "mat_89132132": {
      "color": "#333333",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#ff0000",
      "emissiveIntensity": 1
    },
    "mat_3d9f9132": {
      "color": "#333333",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#00ff00",
      "emissiveIntensity": 1
    },
    "mat_88f67af2": {
      "color": "#333333",
      "metalness": 0.3,
      "roughness": 0.5,
      "emissive": "#ff00ff",
      "emissiveIntensity": 1
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
    }
  },
  "objects": [
    {
      "id": "854b44c8-43d6-4006-828a-24ec642ef905",
      "name": "emissive_none",
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
      "id": "bb8901e6-f11a-4048-a84c-6195de53c935",
      "name": "emissive_low",
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
      "material": "mat_35b9c08e"
    },
    {
      "id": "48d401ee-95d3-4b54-95eb-f9535b4e270a",
      "name": "emissive_medium",
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
      "material": "mat_35b9c08a"
    },
    {
      "id": "8cdd88cf-8723-4763-a112-bc213b353c3c",
      "name": "emissive_high",
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
      "material": "mat_6f3dc2d2"
    },
    {
      "id": "7af99370-250a-4470-af98-99102b786ac0",
      "name": "emissive_red",
      "type": "sphere",
      "position": [
        -2,
        2,
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
      "material": "mat_89132132"
    },
    {
      "id": "b9aefda1-813e-4547-94d0-689501693bc8",
      "name": "emissive_green",
      "type": "sphere",
      "position": [
        0,
        2,
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
      "material": "mat_3d9f9132"
    },
    {
      "id": "6530d3a9-04b2-4f36-8a16-ac50c1c3b26a",
      "name": "emissive_magenta",
      "type": "sphere",
      "position": [
        2,
        2,
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
      "material": "mat_88f67af2"
    }
  ],
  "roots": [
    "854b44c8-43d6-4006-828a-24ec642ef905",
    "bb8901e6-f11a-4048-a84c-6195de53c935",
    "48d401ee-95d3-4b54-95eb-f9535b4e270a",
    "8cdd88cf-8723-4763-a112-bc213b353c3c",
    "7af99370-250a-4470-af98-99102b786ac0",
    "b9aefda1-813e-4547-94d0-689501693bc8",
    "6530d3a9-04b2-4f36-8a16-ac50c1c3b26a"
  ]
}