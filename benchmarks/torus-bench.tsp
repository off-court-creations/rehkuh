{
  "version": "0.9.0",
  "metadata": {
    "name": "Torus Demo",
    "created": "2026-01-11T01:11:58.457Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_4bd0d2_30_40": {
      "color": "#4bd0d2",
      "metalness": 0.3,
      "roughness": 0.4
    },
    "mat_ff6b6b_50_30": {
      "color": "#ff6b6b",
      "metalness": 0.5,
      "roughness": 0.3
    },
    "mat_ffd93d_80_20": {
      "color": "#ffd93d",
      "metalness": 0.8,
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
    "torus": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ]
    },
    "torus_bba64020": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadius": 0.4,
      "torusTube": 0.35
    },
    "torus_1898252c": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadius": 0.6,
      "torusTube": 0.05
    },
    "torus_1a8790e9": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusArc": 3.14159
    },
    "torus_35e67497": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusArc": 1.5708
    },
    "torus_de928c3b": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusArc": 4.71239
    },
    "torus_2524fb08": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadialSegments": 3,
      "torusTubularSegments": 24
    },
    "torus_38168b4f": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadialSegments": 4,
      "torusTubularSegments": 32
    },
    "torus_4cb29f4c": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadialSegments": 6,
      "torusTubularSegments": 6
    }
  },
  "objects": [
    {
      "id": "4a80826b-e44a-4dd4-a973-aa540a867477",
      "name": "Torus Demo",
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
      "id": "5f705c44-9e63-4b4f-8284-1fdbcb98bd27",
      "name": "Default Torus",
      "type": "torus",
      "position": [
        -3,
        0,
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
      "geometry": "torus",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "bba64020-cfd8-45a4-8506-f428abde0241",
      "name": "Thick Tube",
      "type": "torus",
      "position": [
        0,
        0,
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
      "geometry": "torus_bba64020",
      "material": "mat_ff6b6b_50_30"
    },
    {
      "id": "1898252c-2197-4afd-8a19-eb6ed4e79453",
      "name": "Thin Ring",
      "type": "torus",
      "position": [
        3,
        0,
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
      "geometry": "torus_1898252c",
      "material": "mat_ffd93d_80_20"
    },
    {
      "id": "1a8790e9-2507-4060-b41f-2f158d43fc5f",
      "name": "Half Torus (C-shape)",
      "type": "torus",
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
      "geometry": "torus_1a8790e9",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "35e67497-cebc-44ed-a639-e261b4733f86",
      "name": "Quarter Arc",
      "type": "torus",
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
      "geometry": "torus_35e67497",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "de928c3b-e3ee-45ce-8871-3cbbed061873",
      "name": "3/4 Arc (Horseshoe)",
      "type": "torus",
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
      "geometry": "torus_de928c3b",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "2524fb08-e99d-4d82-a690-7135d5bc9770",
      "name": "Triangle Cross-Section",
      "type": "torus",
      "position": [
        -3,
        0,
        -3
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
      "geometry": "torus_2524fb08",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "38168b4f-5f24-4fc0-8e61-35371bfb80e8",
      "name": "Square Cross-Section",
      "type": "torus",
      "position": [
        0,
        0,
        -3
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
      "geometry": "torus_38168b4f",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "4cb29f4c-386c-4935-aaf8-d28cebdc2791",
      "name": "Hex Cross-Section",
      "type": "torus",
      "position": [
        3,
        0,
        -3
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
      "geometry": "torus_4cb29f4c",
      "material": "mat_f39c12_50_30"
    }
  ],
  "roots": [
    "4a80826b-e44a-4dd4-a973-aa540a867477",
    "5f705c44-9e63-4b4f-8284-1fdbcb98bd27",
    "bba64020-cfd8-45a4-8506-f428abde0241",
    "1898252c-2197-4afd-8a19-eb6ed4e79453",
    "1a8790e9-2507-4060-b41f-2f158d43fc5f",
    "35e67497-cebc-44ed-a639-e261b4733f86",
    "de928c3b-e3ee-45ce-8871-3cbbed061873",
    "2524fb08-e99d-4d82-a690-7135d5bc9770",
    "38168b4f-5f24-4fc0-8e61-35371bfb80e8",
    "4cb29f4c-386c-4935-aaf8-d28cebdc2791"
  ]
}