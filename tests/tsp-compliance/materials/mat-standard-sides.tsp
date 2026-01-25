{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "6207ee74-430f-4ab0-83e7-01b490db739d",
    "created": "2026-01-25T20:17:02.850Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "mat-standard-sides",
    "description": "Standard material test: front, back, double sided rendering"
  },
  "materials": {
    "mat_29f1adbf": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "front"
    },
    "mat_e47c1049": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "back"
    },
    "mat_8be0c1d7": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
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
    "cylinder_a8c5e351": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true
    },
    "cylinder_16f1b322": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true
    },
    "cylinder_0fb7b382": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true
    }
  },
  "objects": [
    {
      "id": "e0949686-4ad8-4db4-9ddd-d11ab676ca14",
      "name": "side_front",
      "type": "plane",
      "position": [
        -2,
        0,
        0
      ],
      "rotation": [
        0,
        0.5,
        0
      ],
      "scale": [
        1.5,
        1.5,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane",
      "material": "mat_29f1adbf"
    },
    {
      "id": "753e7e22-1a9f-4887-bd93-f109b0b9fbbb",
      "name": "side_back",
      "type": "plane",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0,
        0.5,
        0
      ],
      "scale": [
        1.5,
        1.5,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane",
      "material": "mat_e47c1049"
    },
    {
      "id": "f021f262-561d-4958-ada6-b673f5cfeb26",
      "name": "side_double",
      "type": "plane",
      "position": [
        2,
        0,
        0
      ],
      "rotation": [
        0,
        0.5,
        0
      ],
      "scale": [
        1.5,
        1.5,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane",
      "material": "mat_8be0c1d7"
    },
    {
      "id": "a8c5e351-0574-4781-9297-31a2c06b6b7b",
      "name": "cylinder_front",
      "type": "cylinder",
      "position": [
        -2,
        2.5,
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
      "geometry": "cylinder_a8c5e351",
      "material": "mat_29f1adbf"
    },
    {
      "id": "16f1b322-4f9b-44f5-96e7-063e3cb9c10b",
      "name": "cylinder_back",
      "type": "cylinder",
      "position": [
        0,
        2.5,
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
      "geometry": "cylinder_16f1b322",
      "material": "mat_e47c1049"
    },
    {
      "id": "0fb7b382-b712-4170-99e9-78178c39a2ac",
      "name": "cylinder_double",
      "type": "cylinder",
      "position": [
        2,
        2.5,
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
      "geometry": "cylinder_0fb7b382",
      "material": "mat_8be0c1d7"
    }
  ],
  "roots": [
    "e0949686-4ad8-4db4-9ddd-d11ab676ca14",
    "753e7e22-1a9f-4887-bd93-f109b0b9fbbb",
    "f021f262-561d-4958-ada6-b673f5cfeb26",
    "a8c5e351-0574-4781-9297-31a2c06b6b7b",
    "16f1b322-4f9b-44f5-96e7-063e3cb9c10b",
    "0fb7b382-b712-4170-99e9-78178c39a2ac"
  ]
}