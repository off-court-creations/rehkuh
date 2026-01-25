{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "eab9c86d-df38-486f-9402-b6495af38ac6",
    "created": "2026-01-25T19:36:19.953Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-capsule",
    "description": "Capsule geometry test: default and custom segments"
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
    }
  },
  "geometries": {
    "capsule": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ]
    },
    "capsule_c2b49741": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleRadius": 0.3,
      "capsuleLength": 2
    },
    "capsule_658fc5a7": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleCapSegments": 2,
      "capsuleRadialSegments": 6
    },
    "capsule_256a13dc": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleCapSegments": 10,
      "capsuleRadialSegments": 24
    }
  },
  "objects": [
    {
      "id": "2738faf1-90f0-4d92-9fcc-dcf0356d2a35",
      "name": "capsule_default",
      "type": "capsule",
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
      "geometry": "capsule",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "c2b49741-c45f-42fd-be29-a3cb51b167bf",
      "name": "capsule_long",
      "type": "capsule",
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
      "geometry": "capsule_c2b49741",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "658fc5a7-4c30-4c31-8006-6abbb10638e3",
      "name": "capsule_lowpoly",
      "type": "capsule",
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
      "geometry": "capsule_658fc5a7",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "256a13dc-428e-4471-8b3a-0dd03e5ab682",
      "name": "capsule_highpoly",
      "type": "capsule",
      "position": [
        0,
        2.5,
        0
      ],
      "rotation": [
        0,
        0,
        1.5708
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "capsule_256a13dc",
      "material": "mat_9b5de5_30_50"
    }
  ],
  "roots": [
    "2738faf1-90f0-4d92-9fcc-dcf0356d2a35",
    "c2b49741-c45f-42fd-be29-a3cb51b167bf",
    "658fc5a7-4c30-4c31-8006-6abbb10638e3",
    "256a13dc-428e-4471-8b3a-0dd03e5ab682"
  ]
}