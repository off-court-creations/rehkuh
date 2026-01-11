{
  "version": "0.9.0",
  "metadata": {
    "name": "Plane Demo",
    "created": "2026-01-11T03:05:23.057Z",
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
    "plane": {
      "type": "plane",
      "args": [
        1,
        1
      ]
    },
    "plane_931faee8": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 10
    },
    "plane_5bbc8103": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeHeightSegments": 10
    },
    "plane_700f42cc": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 5,
      "planeHeightSegments": 5
    },
    "plane_5cb7ae18": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 10,
      "planeHeightSegments": 10
    },
    "plane_d72c8084": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 20,
      "planeHeightSegments": 20
    },
    "plane_ec0a7c70": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 20,
      "planeHeightSegments": 1
    },
    "plane_00f63a51": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 1,
      "planeHeightSegments": 20
    },
    "plane_5a59fb94": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 50,
      "planeHeightSegments": 50
    }
  },
  "objects": [
    {
      "id": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "name": "Plane Demo",
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
      "id": "6f060acc-bbe3-4e78-9b39-f38e6ea1fa1e",
      "name": "Default Plane",
      "type": "plane",
      "position": [
        -3,
        0,
        2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "931faee8-2761-43fb-a5f5-9c5f5cd492fc",
      "name": "Width Segments (10)",
      "type": "plane",
      "position": [
        0,
        0,
        2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_931faee8",
      "material": "mat_ff6b6b_20_60"
    },
    {
      "id": "5bbc8103-8e39-4d26-a7a3-2d8926f7bb36",
      "name": "Height Segments (10)",
      "type": "plane",
      "position": [
        3,
        0,
        2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_5bbc8103",
      "material": "mat_ffd93d_50_30"
    },
    {
      "id": "700f42cc-ef9b-48ee-a5fd-0aa9a5ce149d",
      "name": "Grid (5x5)",
      "type": "plane",
      "position": [
        -3,
        0,
        0
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_700f42cc",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "5cb7ae18-3945-421e-a6a7-4f5a7374a97c",
      "name": "Grid (10x10)",
      "type": "plane",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_5cb7ae18",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "d72c8084-0521-4bfc-8460-33e4465bcf7b",
      "name": "Grid (20x20)",
      "type": "plane",
      "position": [
        3,
        0,
        0
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_d72c8084",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "ec0a7c70-b0e5-40b6-a4f0-4c4a79897855",
      "name": "Wide Strip (20x1)",
      "type": "plane",
      "position": [
        -3,
        0,
        -2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        2,
        0.5,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_ec0a7c70",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "00f63a51-2445-49f2-9cff-f96bfeb6b493",
      "name": "Tall Strip (1x20)",
      "type": "plane",
      "position": [
        0,
        0,
        -2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        0.5,
        2,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_00f63a51",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "5a59fb94-d83f-4dfb-be95-f70766ba5dc6",
      "name": "Dense Grid (50x50)",
      "type": "plane",
      "position": [
        3,
        0,
        -2
      ],
      "rotation": [
        -1.57,
        0,
        0
      ],
      "scale": [
        1.5,
        1.5,
        1
      ],
      "parent": "933fee1a-6870-435f-a78b-9fe8c40fd08d",
      "visible": true,
      "geometry": "plane_5a59fb94",
      "material": "mat_f39c12_50_30"
    }
  ],
  "roots": [
    "933fee1a-6870-435f-a78b-9fe8c40fd08d"
  ]
}