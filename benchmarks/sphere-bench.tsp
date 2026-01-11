{
  "version": "0.9.0",
  "metadata": {
    "name": "Sphere Demo",
    "created": "2026-01-11T01:13:02.788Z",
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
    },
    "mat_e056fd_40_30": {
      "color": "#e056fd",
      "metalness": 0.4,
      "roughness": 0.3
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
    "sphere_afa4cf16": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereWidthSegments": 8,
      "sphereHeightSegments": 6
    },
    "sphere_b4d182cd": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereWidthSegments": 64,
      "sphereHeightSegments": 48
    },
    "sphere_1fb78bd6": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereThetaLength": 1.5708
    },
    "sphere_2483da90": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereThetaStart": 1.5708,
      "sphereThetaLength": 1.5708
    },
    "sphere_3e157539": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereThetaStart": 0.7854,
      "sphereThetaLength": 1.5708
    },
    "sphere_d51229dc": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiLength": 3.14159
    },
    "sphere_0e05375d": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiLength": 1.5708
    },
    "sphere_3a078407": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiStart": 0.7854,
      "spherePhiLength": 2.3562
    },
    "sphere_e385075f": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiLength": 2.3562,
      "sphereThetaLength": 1.5708
    }
  },
  "objects": [
    {
      "id": "02fe1bb5-2f46-49e7-8c0e-dae454d6958b",
      "name": "Sphere Demo",
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
      "id": "a593835f-7ab5-4354-9127-ecb079fa6760",
      "name": "Default Sphere",
      "type": "sphere",
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
      "geometry": "sphere",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "afa4cf16-93d1-4c51-be5c-2fcd5d75e40e",
      "name": "Low Poly (8x6)",
      "type": "sphere",
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
      "geometry": "sphere_afa4cf16",
      "material": "mat_ff6b6b_20_60"
    },
    {
      "id": "b4d182cd-d904-46b7-b36d-98e82bd1ccc7",
      "name": "High Poly (64x48)",
      "type": "sphere",
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
      "geometry": "sphere_b4d182cd",
      "material": "mat_ffd93d_80_20"
    },
    {
      "id": "1fb78bd6-8d2e-40c6-9bb6-f3e584bd1967",
      "name": "Dome (thetaLength=π/2)",
      "type": "sphere",
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
      "geometry": "sphere_1fb78bd6",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "2483da90-de82-4367-9005-06d48a622a2b",
      "name": "Bowl (thetaStart=π/2)",
      "type": "sphere",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        3.14159,
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
      "geometry": "sphere_2483da90",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "3e157539-1f49-4345-91f3-5d35557323c0",
      "name": "Hemisphere Band",
      "type": "sphere",
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
      "geometry": "sphere_3e157539",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "d51229dc-af73-4ebf-b910-9b4ff34b55d3",
      "name": "Half (phiLength=π)",
      "type": "sphere",
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
      "geometry": "sphere_d51229dc",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "0e05375d-f8f3-4679-8f18-276d7f4c5d08",
      "name": "Wedge (phiLength=π/2)",
      "type": "sphere",
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
      "geometry": "sphere_0e05375d",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "3a078407-8ee6-4fd7-b0a4-4c1e5a9c876a",
      "name": "Offset Wedge",
      "type": "sphere",
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
      "geometry": "sphere_3a078407",
      "material": "mat_f39c12_50_30"
    },
    {
      "id": "e385075f-66a0-447f-9f58-4f8beaa37338",
      "name": "Dome Wedge (combined)",
      "type": "sphere",
      "position": [
        0,
        0,
        -6
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        1.5,
        1.5,
        1.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere_e385075f",
      "material": "mat_e056fd_40_30"
    }
  ],
  "roots": [
    "02fe1bb5-2f46-49e7-8c0e-dae454d6958b",
    "a593835f-7ab5-4354-9127-ecb079fa6760",
    "afa4cf16-93d1-4c51-be5c-2fcd5d75e40e",
    "b4d182cd-d904-46b7-b36d-98e82bd1ccc7",
    "1fb78bd6-8d2e-40c6-9bb6-f3e584bd1967",
    "2483da90-de82-4367-9005-06d48a622a2b",
    "3e157539-1f49-4345-91f3-5d35557323c0",
    "d51229dc-af73-4ebf-b910-9b4ff34b55d3",
    "0e05375d-f8f3-4679-8f18-276d7f4c5d08",
    "3a078407-8ee6-4fd7-b0a4-4c1e5a9c876a",
    "e385075f-66a0-447f-9f58-4f8beaa37338"
  ]
}