{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "bb169747-15a0-46f1-90b6-4ba714ccb439",
    "created": "2026-01-25T20:29:02.863Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Anisotropy Test",
    "description": "Tests anisotropy and anisotropyRotation for brushed metal effects"
  },
  "materials": {
    "mat_physical_8b2ba9c6": {
      "type": "physical",
      "color": "#C0C0C0",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 0
    },
    "mat_physical_4bd379d": {
      "type": "physical",
      "color": "#C0C0C0",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 0.5
    },
    "mat_physical_8b2ba9c7": {
      "type": "physical",
      "color": "#C0C0C0",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1
    },
    "mat_physical_16801e1d": {
      "type": "physical",
      "color": "#B8860B",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1,
      "anisotropyRotation": 0
    },
    "mat_physical_61d794dd": {
      "type": "physical",
      "color": "#B8860B",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1,
      "anisotropyRotation": 0.7854
    },
    "mat_physical_64097698": {
      "type": "physical",
      "color": "#B8860B",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1,
      "anisotropyRotation": 1.5708
    },
    "mat_physical_da7d7e25": {
      "type": "physical",
      "color": "#B87333",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1,
      "anisotropyRotation": 0
    },
    "mat_physical_2cdcabe0": {
      "type": "physical",
      "color": "#B87333",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 1,
      "anisotropyRotation": 1.5708
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
    "torusKnot": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ]
    }
  },
  "objects": [
    {
      "id": "712ee367-2de8-4c82-8389-1167dd276b82",
      "name": "anisotropy_none",
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
      "material": "mat_physical_8b2ba9c6"
    },
    {
      "id": "df275e17-6dbe-4a01-8942-113b4fa65aea",
      "name": "anisotropy_medium",
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
      "material": "mat_physical_4bd379d"
    },
    {
      "id": "f61b626e-64d2-4f9f-9f63-e3618dfa66a9",
      "name": "anisotropy_full",
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
      "material": "mat_physical_8b2ba9c7"
    },
    {
      "id": "e1a867d5-9e2b-4aab-be35-e11524122350",
      "name": "rotation_0",
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
      "material": "mat_physical_16801e1d"
    },
    {
      "id": "6e8fd9a2-e7b4-444e-b7a6-d69fc89875d4",
      "name": "rotation_45",
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
      "material": "mat_physical_61d794dd"
    },
    {
      "id": "f8f59100-c062-49d8-a06a-c4dac7813945",
      "name": "rotation_90",
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
      "material": "mat_physical_64097698"
    },
    {
      "id": "9644dd3c-9705-43d7-9f3f-197df812b216",
      "name": "brushed_torus",
      "type": "torus",
      "position": [
        -1.5,
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
      "material": "mat_physical_da7d7e25"
    },
    {
      "id": "48704d0d-8753-4ac0-a839-d80eb2908442",
      "name": "brushed_torusknot",
      "type": "torusKnot",
      "position": [
        1.5,
        0.5,
        -3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        0.5,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "torusKnot",
      "material": "mat_physical_2cdcabe0"
    }
  ],
  "roots": [
    "712ee367-2de8-4c82-8389-1167dd276b82",
    "df275e17-6dbe-4a01-8942-113b4fa65aea",
    "f61b626e-64d2-4f9f-9f63-e3618dfa66a9",
    "e1a867d5-9e2b-4aab-be35-e11524122350",
    "6e8fd9a2-e7b4-444e-b7a6-d69fc89875d4",
    "f8f59100-c062-49d8-a06a-c4dac7813945",
    "9644dd3c-9705-43d7-9f3f-197df812b216",
    "48704d0d-8753-4ac0-a839-d80eb2908442"
  ]
}