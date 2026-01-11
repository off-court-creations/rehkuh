{
  "version": "0.9.0",
  "metadata": {
    "name": "Ring Demo",
    "created": "2026-01-11T03:25:54.014Z",
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
    "mat_ffd93d_80_10": {
      "color": "#ffd93d",
      "metalness": 0.8,
      "roughness": 0.1
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
    "mat_ff9f43_50_30": {
      "color": "#ff9f43",
      "metalness": 0.5,
      "roughness": 0.3
    },
    "mat_ee5a24_40_40": {
      "color": "#ee5a24",
      "metalness": 0.4,
      "roughness": 0.4
    },
    "mat_ffc312_20_40": {
      "color": "#ffc312",
      "metalness": 0.2,
      "roughness": 0.4
    }
  },
  "geometries": {
    "ring": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ]
    },
    "ring_7fd7c54e": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringOuterRadius": 0.8
    },
    "ring_3a372fa7": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringInnerRadius": 0.45,
      "ringOuterRadius": 0.5
    },
    "ring_a2b087f4": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringInnerRadius": 0
    },
    "ring_d8cf23dc": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaSegments": 3
    },
    "ring_3d187202": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaSegments": 6
    },
    "ring_e51e0b23": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaLength": 3.14159
    },
    "ring_2c6dd161": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaLength": 1.5708
    },
    "ring_eaf6f7f0": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringInnerRadius": 0,
      "ringThetaStart": 0.4,
      "ringThetaLength": 5.48
    }
  },
  "objects": [
    {
      "id": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "name": "Ring Demo",
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
      "id": "d83367e2-e06d-4b0f-9503-37434eff5a13",
      "name": "Default Ring",
      "type": "ring",
      "position": [
        -3,
        0.01,
        2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "7fd7c54e-ffdc-4c2e-a70c-6c4084ee3200",
      "name": "Large Outer (0.8)",
      "type": "ring",
      "position": [
        0,
        0.01,
        2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_7fd7c54e",
      "material": "mat_ff6b6b_20_50"
    },
    {
      "id": "3a372fa7-6716-43a7-8921-170d5c1b490d",
      "name": "Thin Halo",
      "type": "ring",
      "position": [
        3,
        0.01,
        2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_3a372fa7",
      "material": "mat_ffd93d_80_10"
    },
    {
      "id": "a2b087f4-08f2-4a3e-a360-36757dc6c88a",
      "name": "Filled Disc (no hole)",
      "type": "ring",
      "position": [
        -3,
        0.01,
        0
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_a2b087f4",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "d8cf23dc-64e0-4168-9d8f-b3ce63ed794e",
      "name": "Triangle Ring (3 segs)",
      "type": "ring",
      "position": [
        0,
        0.01,
        0
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_d8cf23dc",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "3d187202-6c4d-4439-a06a-7206d299b813",
      "name": "Hexagon Ring (6 segs)",
      "type": "ring",
      "position": [
        3,
        0.01,
        0
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_3d187202",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "e51e0b23-8e6c-4eca-8071-6d1b1442812a",
      "name": "Half Ring (π)",
      "type": "ring",
      "position": [
        -3,
        0.01,
        -2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_e51e0b23",
      "material": "mat_ff9f43_50_30"
    },
    {
      "id": "2c6dd161-4a28-4010-8bf4-ca003c1398cd",
      "name": "Quarter Arc (π/2)",
      "type": "ring",
      "position": [
        0,
        0.01,
        -2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_2c6dd161",
      "material": "mat_ee5a24_40_40"
    },
    {
      "id": "eaf6f7f0-ce8f-4779-8e1d-7a41c774fbe8",
      "name": "Pac-Man Ring (270°)",
      "type": "ring",
      "position": [
        3,
        0.01,
        -2
      ],
      "rotation": [
        -1.5708,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "3eefe775-8fda-4ee1-8c01-e11777cec8e9",
      "visible": true,
      "geometry": "ring_eaf6f7f0",
      "material": "mat_ffc312_20_40"
    }
  ],
  "roots": [
    "3eefe775-8fda-4ee1-8c01-e11777cec8e9"
  ]
}