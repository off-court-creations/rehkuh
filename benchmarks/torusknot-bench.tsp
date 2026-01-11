{
  "version": "0.9.0",
  "metadata": {
    "name": "TorusKnot Demo",
    "created": "2026-01-11T03:33:55.174Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_4bd0d2_30_40": {
      "color": "#4bd0d2",
      "metalness": 0.3,
      "roughness": 0.4
    },
    "mat_ff6b6b_20_50": {
      "color": "#ff6b6b",
      "metalness": 0.2,
      "roughness": 0.5
    },
    "mat_ffd93d_50_20": {
      "color": "#ffd93d",
      "metalness": 0.5,
      "roughness": 0.2
    },
    "mat_6bcb77_30_50": {
      "color": "#6bcb77",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_4d96ff_40_40": {
      "color": "#4d96ff",
      "metalness": 0.4,
      "roughness": 0.4
    },
    "mat_9b59b6_30_50": {
      "color": "#9b59b6",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ff9f43_60_20": {
      "color": "#ff9f43",
      "metalness": 0.6,
      "roughness": 0.2
    },
    "mat_ee5a24_40_40": {
      "color": "#ee5a24",
      "metalness": 0.4,
      "roughness": 0.4
    },
    "mat_00d2d3_50_30": {
      "color": "#00d2d3",
      "metalness": 0.5,
      "roughness": 0.3
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
    "torusKnot_fa0a0653": {
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
      "torusKnotQ": 2
    },
    "torusKnot_1edc9d97": {
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
    "torusKnot_4f5df291": {
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
      "torusKnotQ": 4
    },
    "torusKnot_f2544486": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotTube": 0.3
    },
    "torusKnot_41663f2b": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotRadius": 0.8
    },
    "torusKnot_9fa1ca4f": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotTubularSegments": 128,
      "torusKnotRadialSegments": 16
    },
    "torusKnot_40a9676e": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotTubularSegments": 16,
      "torusKnotRadialSegments": 4
    },
    "torusKnot_0e64ff5e": {
      "type": "torusKnot",
      "args": [
        0.5,
        0.15,
        64,
        8,
        2,
        3
      ],
      "torusKnotTubularSegments": 128,
      "torusKnotP": 5,
      "torusKnotQ": 7
    }
  },
  "objects": [
    {
      "id": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "name": "TorusKnot Demo",
      "type": "group",
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
      "visible": true
    },
    {
      "id": "65576884-8541-40cf-bec9-53fab76ae386",
      "name": "Default (p=2, q=3)",
      "type": "torusKnot",
      "position": [
        -3,
        1,
        2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "fa0a0653-d49c-423f-8a20-1c425f50793d",
      "name": "p=3, q=2",
      "type": "torusKnot",
      "position": [
        0,
        1,
        2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_fa0a0653",
      "material": "mat_ff6b6b_20_50"
    },
    {
      "id": "1edc9d97-513a-4e7b-b8cc-6e17eb2cdd33",
      "name": "p=2, q=5 (Complex)",
      "type": "torusKnot",
      "position": [
        3,
        1,
        2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_1edc9d97",
      "material": "mat_ffd93d_50_20"
    },
    {
      "id": "4f5df291-a900-446f-9a9e-665662081d15",
      "name": "p=3, q=4 (Star)",
      "type": "torusKnot",
      "position": [
        -3,
        1,
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_4f5df291",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "f2544486-a1b6-4130-8dbd-31b7ded577c1",
      "name": "Thick Tube (0.3)",
      "type": "torusKnot",
      "position": [
        0,
        1,
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_f2544486",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "41663f2b-e492-4f94-b9b0-ea42a2fefcf4",
      "name": "Large Radius (0.8)",
      "type": "torusKnot",
      "position": [
        3,
        1,
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_41663f2b",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "9fa1ca4f-a7e2-4322-84aa-9c19a1a9eef0",
      "name": "High Detail (128 tubular)",
      "type": "torusKnot",
      "position": [
        -3,
        1,
        -2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_9fa1ca4f",
      "material": "mat_ff9f43_60_20"
    },
    {
      "id": "40a9676e-8c49-4f8f-a611-303f9ea99d44",
      "name": "Low Poly (16 tubular)",
      "type": "torusKnot",
      "position": [
        0,
        1,
        -2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_40a9676e",
      "material": "mat_ee5a24_40_40"
    },
    {
      "id": "0e64ff5e-7f79-4948-875c-48331c0f0a34",
      "name": "p=5, q=7 (Dense)",
      "type": "torusKnot",
      "position": [
        3,
        1,
        -2
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
      "parent": "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69",
      "visible": true,
      "geometry": "torusKnot_0e64ff5e",
      "material": "mat_00d2d3_50_30"
    }
  ],
  "roots": [
    "5d7408dd-0fbf-4bd4-a7f5-935cfbd25e69"
  ]
}