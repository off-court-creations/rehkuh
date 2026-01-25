{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "1cd03243-0897-437a-8b9d-c98c509c902c",
    "created": "2026-01-25T19:41:20.911Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-torusknot",
    "description": "TorusKnot geometry test: various p/q values (2,3), (3,5), (2,5)"
  },
  "materials": {
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_d94a4a_30_50": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_4ad94a_30_50": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_9b5de5_30_50": {
      "color": "#9b5de5",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ff6b35_30_50": {
      "color": "#ff6b35",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
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
    },
    "torusKnot_3991a496": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotP": 2,
      "torusKnotQ": 3
    },
    "torusKnot_d8cb7010": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotP": 3,
      "torusKnotQ": 5
    },
    "torusKnot_19c5e4b2": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotP": 2,
      "torusKnotQ": 5
    },
    "torusKnot_aa835b41": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotTube": 0.25
    }
  },
  "objects": [
    {
      "id": "dcaeede1-2d04-43cd-b821-39493ba322d8",
      "name": "torusknot_default",
      "type": "torusKnot",
      "position": [
        -4,
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
      "geometry": "torusKnot",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "3991a496-e4c4-4286-8c85-6565fb294307",
      "name": "torusknot_2_3",
      "type": "torusKnot",
      "position": [
        -1.5,
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
      "geometry": "torusKnot_3991a496",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "d8cb7010-a31d-43ed-ac0c-4102e81a4fd0",
      "name": "torusknot_3_5",
      "type": "torusKnot",
      "position": [
        1.5,
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
      "geometry": "torusKnot_d8cb7010",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "19c5e4b2-e9e0-45f5-9826-07a373d71012",
      "name": "torusknot_2_5",
      "type": "torusKnot",
      "position": [
        4,
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
      "geometry": "torusKnot_19c5e4b2",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "aa835b41-6cd9-4c8f-881e-70ac90773099",
      "name": "torusknot_thick",
      "type": "torusKnot",
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
      "geometry": "torusKnot_aa835b41",
      "material": "mat_ff6b35_30_50"
    }
  ],
  "roots": [
    "dcaeede1-2d04-43cd-b821-39493ba322d8",
    "3991a496-e4c4-4286-8c85-6565fb294307",
    "d8cb7010-a31d-43ed-ac0c-4102e81a4fd0",
    "19c5e4b2-e9e0-45f5-9826-07a373d71012",
    "aa835b41-6cd9-4c8f-881e-70ac90773099"
  ]
}