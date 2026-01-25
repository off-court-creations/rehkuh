{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "d5a36ba8-66f0-4298-ab4e-8053d791921a",
    "created": "2026-01-25T19:33:30.783Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-cone",
    "description": "Cone geometry test: pyramid (radialSegments=4), open-ended, partial theta"
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
      "roughness": 0.5,
      "side": "double"
    },
    "mat_d9d94a_30_50": {
      "color": "#d9d94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
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
    "cone": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ]
    },
    "cone_fd572a1c": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneRadialSegments": 4
    },
    "cone_58a5aec5": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneOpenEnded": true
    },
    "cone_d39ee57d": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneThetaLength": 4.7124
    },
    "cone_6ce20e77": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneRadialSegments": 3
    }
  },
  "objects": [
    {
      "id": "eb20f9cb-f35f-430e-81b4-611bc7855bda",
      "name": "cone_default",
      "type": "cone",
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
      "geometry": "cone",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "fd572a1c-b1a9-4662-9216-c06c9a243505",
      "name": "cone_pyramid",
      "type": "cone",
      "position": [
        -2,
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
      "geometry": "cone_fd572a1c",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "58a5aec5-48a5-4595-ac9c-3fbd77418d1b",
      "name": "cone_open",
      "type": "cone",
      "position": [
        0,
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
      "geometry": "cone_58a5aec5",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "d39ee57d-e477-43b9-b4c7-3a53e7ad5869",
      "name": "cone_partial",
      "type": "cone",
      "position": [
        2,
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
      "geometry": "cone_d39ee57d",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "6ce20e77-b6da-4795-92fa-73349549b99a",
      "name": "cone_triprism",
      "type": "cone",
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
      "geometry": "cone_6ce20e77",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "da31d4f9-780a-48fe-8a67-d62b69e9a215",
      "name": "cone_tall",
      "type": "cone",
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
        0.5,
        2,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "cone",
      "material": "mat_ff6b35_30_50"
    }
  ],
  "roots": [
    "eb20f9cb-f35f-430e-81b4-611bc7855bda",
    "fd572a1c-b1a9-4662-9216-c06c9a243505",
    "58a5aec5-48a5-4595-ac9c-3fbd77418d1b",
    "d39ee57d-e477-43b9-b4c7-3a53e7ad5869",
    "6ce20e77-b6da-4795-92fa-73349549b99a",
    "da31d4f9-780a-48fe-8a67-d62b69e9a215"
  ]
}