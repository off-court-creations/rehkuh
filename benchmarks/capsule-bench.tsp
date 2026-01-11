{
  "version": "0.9.0",
  "metadata": {
    "name": "Capsule Demo",
    "created": "2026-01-11T03:10:34.313Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_4bd0d2_30_40": {
      "color": "#4bd0d2",
      "metalness": 0.3,
      "roughness": 0.4
    },
    "mat_ff6b6b_20_60": {
      "color": "#ff6b6b",
      "metalness": 0.2,
      "roughness": 0.6
    },
    "mat_ffd93d_50_30": {
      "color": "#ffd93d",
      "metalness": 0.5,
      "roughness": 0.3
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
    "mat_e74c3c_20_60": {
      "color": "#e74c3c",
      "metalness": 0.2,
      "roughness": 0.6
    },
    "mat_1abc9c_40_40": {
      "color": "#1abc9c",
      "metalness": 0.4,
      "roughness": 0.4
    },
    "mat_f39c12_50_30": {
      "color": "#f39c12",
      "metalness": 0.5,
      "roughness": 0.3
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
    "capsule_9b86fd9e": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleRadius": 0.8
    },
    "capsule_7db91e77": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleRadius": 0.2
    },
    "capsule_3d8a8f24": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleLength": 3
    },
    "capsule_b9a4cd67": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleLength": 0
    },
    "capsule_da59d73b": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleCapSegments": 16
    },
    "capsule_743897c7": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleRadialSegments": 4
    },
    "capsule_20fab8f0": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleRadialSegments": 6
    },
    "capsule_55c93f3a": {
      "type": "capsule",
      "args": [
        0.5,
        1,
        4,
        8
      ],
      "capsuleCapSegments": 16,
      "capsuleRadialSegments": 32
    }
  },
  "objects": [
    {
      "id": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "name": "Capsule Demo",
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
      "id": "30d8791a-4074-4a60-b69a-2f1fc239bb02",
      "name": "Default Capsule",
      "type": "capsule",
      "position": [
        -3,
        0.75,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "9b86fd9e-24e8-4b19-a69e-f574e86efa25",
      "name": "Large Radius (0.8)",
      "type": "capsule",
      "position": [
        0,
        0.9,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_9b86fd9e",
      "material": "mat_ff6b6b_20_60"
    },
    {
      "id": "7db91e77-a073-4703-b3df-a691ba986a64",
      "name": "Small Radius (0.2)",
      "type": "capsule",
      "position": [
        3,
        0.6,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_7db91e77",
      "material": "mat_ffd93d_50_30"
    },
    {
      "id": "3d8a8f24-40ff-4050-a015-3c5efbdf9f95",
      "name": "Long Length (3)",
      "type": "capsule",
      "position": [
        -3,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_3d8a8f24",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "b9a4cd67-5eba-4d04-9e61-93ebe83d839b",
      "name": "Zero Length (Sphere)",
      "type": "capsule",
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_b9a4cd67",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "da59d73b-78dd-4b6b-8f18-0fe8664603eb",
      "name": "High Cap Segments (16)",
      "type": "capsule",
      "position": [
        3,
        0.75,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_da59d73b",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "743897c7-0ee1-420a-915d-3fa96ecc27c9",
      "name": "Low Radial (4) - Square",
      "type": "capsule",
      "position": [
        -3,
        0.75,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_743897c7",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "20fab8f0-6a99-478b-ae61-55d87f7f32dd",
      "name": "Hex Radial (6)",
      "type": "capsule",
      "position": [
        0,
        0.75,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_20fab8f0",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "55c93f3a-f1a1-4549-b5c3-17b43289897c",
      "name": "High Detail (32x16)",
      "type": "capsule",
      "position": [
        3,
        0.75,
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
      "parent": "ce44e644-dac5-43d8-b0ba-a7cff6edb465",
      "visible": true,
      "geometry": "capsule_55c93f3a",
      "material": "mat_f39c12_50_30"
    }
  ],
  "roots": [
    "ce44e644-dac5-43d8-b0ba-a7cff6edb465"
  ]
}