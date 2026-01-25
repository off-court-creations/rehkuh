{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "324dd8be-1b76-4529-9fdb-5354dd969a23",
    "created": "2026-01-25T20:18:31.461Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "mat-physical-clearcoat",
    "description": "Physical material test: car paint effect (clearcoat + clearcoatRoughness)"
  },
  "materials": {
    "mat_physical_9f8e475c": {
      "type": "physical",
      "color": "#8b0000",
      "metalness": 0.5,
      "roughness": 0.5
    },
    "mat_physical_84310658": {
      "type": "physical",
      "color": "#8b0000",
      "metalness": 0.5,
      "roughness": 0.5,
      "clearcoat": 0.5,
      "clearcoatRoughness": 0.1
    },
    "mat_physical_c1a986dd": {
      "type": "physical",
      "color": "#8b0000",
      "metalness": 0.5,
      "roughness": 0.5,
      "clearcoat": 1,
      "clearcoatRoughness": 0
    },
    "mat_physical_d226ac86": {
      "type": "physical",
      "color": "#8b0000",
      "metalness": 0.5,
      "roughness": 0.5,
      "clearcoat": 1,
      "clearcoatRoughness": 0.5
    },
    "mat_physical_58d686bd": {
      "type": "physical",
      "color": "#00008b",
      "metalness": 0.8,
      "roughness": 0.3,
      "clearcoat": 1,
      "clearcoatRoughness": 0.05
    },
    "mat_physical_3c058f34": {
      "type": "physical",
      "color": "#daa520",
      "metalness": 0.9,
      "roughness": 0.2,
      "clearcoat": 1,
      "clearcoatRoughness": 0.05
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
      "id": "fe93dd3d-5211-457e-97f3-a4b22cd3b18e",
      "name": "no_clearcoat",
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
      "material": "mat_physical_9f8e475c"
    },
    {
      "id": "53a81428-353d-49e5-91e7-36a1aeb405ea",
      "name": "clearcoat_low",
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
      "material": "mat_physical_84310658"
    },
    {
      "id": "daa973d1-78fb-4854-bec0-04e2dbfd15c0",
      "name": "clearcoat_high",
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
      "material": "mat_physical_c1a986dd"
    },
    {
      "id": "69ee2213-1462-4375-b7d4-102a0ae89df7",
      "name": "clearcoat_rough",
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
      "material": "mat_physical_d226ac86"
    },
    {
      "id": "917e0bb9-0bcf-4c3c-b1e6-a635ea2c0c8a",
      "name": "carpaint_blue",
      "type": "sphere",
      "position": [
        -1,
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
      "material": "mat_physical_58d686bd"
    },
    {
      "id": "a8c7d354-c45c-4b8c-a564-aca3b5e9c497",
      "name": "carpaint_gold",
      "type": "sphere",
      "position": [
        1,
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
      "material": "mat_physical_3c058f34"
    }
  ],
  "roots": [
    "fe93dd3d-5211-457e-97f3-a4b22cd3b18e",
    "53a81428-353d-49e5-91e7-36a1aeb405ea",
    "daa973d1-78fb-4854-bec0-04e2dbfd15c0",
    "69ee2213-1462-4375-b7d4-102a0ae89df7",
    "917e0bb9-0bcf-4c3c-b1e6-a635ea2c0c8a",
    "a8c7d354-c45c-4b8c-a564-aca3b5e9c497"
  ]
}