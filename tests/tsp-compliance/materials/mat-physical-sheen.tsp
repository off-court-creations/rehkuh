{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "4af96c71-2951-4c85-ac4e-3e2de5133da4",
    "created": "2026-01-25T20:20:42.090Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Sheen Test",
    "description": "Tests sheen, sheenRoughness, and sheenColor for velvet/fabric effects"
  },
  "materials": {
    "mat_physical_8ca9c86a": {
      "type": "physical",
      "color": "#8B0000",
      "metalness": 0,
      "roughness": 1,
      "sheen": 0.3,
      "sheenRoughness": 0.8,
      "sheenColor": "#FFFFFF"
    },
    "mat_physical_9eb6f2a3": {
      "type": "physical",
      "color": "#8B0000",
      "metalness": 0,
      "roughness": 1,
      "sheen": 0.7,
      "sheenRoughness": 0.5,
      "sheenColor": "#FFFFFF"
    },
    "mat_physical_2191d6bc": {
      "type": "physical",
      "color": "#8B0000",
      "metalness": 0,
      "roughness": 1,
      "sheen": 1,
      "sheenRoughness": 0.2,
      "sheenColor": "#FFFFFF"
    },
    "mat_physical_6d3a8000": {
      "type": "physical",
      "color": "#1a1a2e",
      "metalness": 0,
      "roughness": 1,
      "sheen": 0.8,
      "sheenRoughness": 0.4,
      "sheenColor": "#4488FF"
    },
    "mat_physical_b556e8d6": {
      "type": "physical",
      "color": "#2a1a0a",
      "metalness": 0,
      "roughness": 1,
      "sheen": 0.8,
      "sheenRoughness": 0.4,
      "sheenColor": "#FFD700"
    },
    "mat_physical_223171de": {
      "type": "physical",
      "color": "#2a1a2a",
      "metalness": 0,
      "roughness": 1,
      "sheen": 0.8,
      "sheenRoughness": 0.4,
      "sheenColor": "#FF69B4"
    },
    "mat_physical_9f11db70": {
      "type": "physical",
      "color": "#4B0082",
      "metalness": 0,
      "roughness": 1,
      "sheen": 1,
      "sheenRoughness": 0.3,
      "sheenColor": "#9370DB"
    },
    "mat_physical_3002fc9d": {
      "type": "physical",
      "color": "#228B22",
      "metalness": 0,
      "roughness": 0.8,
      "sheen": 0.9,
      "sheenRoughness": 0.2,
      "sheenColor": "#90EE90"
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
      "id": "2743edd9-6c53-4177-8e85-d4b4f58694cf",
      "name": "sheen_low",
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
      "material": "mat_physical_8ca9c86a"
    },
    {
      "id": "1e4c9475-fa84-4574-9233-f9294123ba0d",
      "name": "sheen_medium",
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
      "material": "mat_physical_9eb6f2a3"
    },
    {
      "id": "a068873c-cd6f-4ada-8e82-3f185a52e546",
      "name": "sheen_high",
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
      "material": "mat_physical_2191d6bc"
    },
    {
      "id": "8f1b87fc-f100-44fd-be29-b79a2c0b3d7c",
      "name": "sheen_blue_tint",
      "type": "sphere",
      "position": [
        -3,
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
      "material": "mat_physical_6d3a8000"
    },
    {
      "id": "36a0dd05-e64f-4b25-ba17-4d25f58c1607",
      "name": "sheen_gold_tint",
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
      "material": "mat_physical_b556e8d6"
    },
    {
      "id": "9602ac5c-23a5-442a-ac4e-ea42744c8a27",
      "name": "sheen_pink_tint",
      "type": "sphere",
      "position": [
        3,
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
      "material": "mat_physical_223171de"
    },
    {
      "id": "3938c625-155d-450d-8b3c-676d6f9d7584",
      "name": "velvet_cube",
      "type": "box",
      "position": [
        -1.5,
        0.5,
        -3
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
      "material": "mat_physical_9f11db70"
    },
    {
      "id": "6a684bd1-a4db-489d-81e6-a6b2304c357b",
      "name": "silk_torus",
      "type": "torus",
      "position": [
        1.5,
        0.5,
        -3
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
      "material": "mat_physical_3002fc9d"
    }
  ],
  "roots": [
    "2743edd9-6c53-4177-8e85-d4b4f58694cf",
    "1e4c9475-fa84-4574-9233-f9294123ba0d",
    "a068873c-cd6f-4ada-8e82-3f185a52e546",
    "8f1b87fc-f100-44fd-be29-b79a2c0b3d7c",
    "36a0dd05-e64f-4b25-ba17-4d25f58c1607",
    "9602ac5c-23a5-442a-ac4e-ea42744c8a27",
    "3938c625-155d-450d-8b3c-676d6f9d7584",
    "6a684bd1-a4db-489d-81e6-a6b2304c357b"
  ]
}