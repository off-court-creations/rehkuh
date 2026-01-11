{
  "version": "0.9.0",
  "metadata": {
    "name": "scene",
    "created": "2026-01-11T01:03:40.140Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_4488ff_30_50": {
      "color": "#4488ff",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_44ff88_30_50": {
      "color": "#44ff88",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ff8844_30_50": {
      "color": "#ff8844",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ffaa00_30_50": {
      "color": "#ffaa00",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ff44aa_30_50": {
      "color": "#ff44aa",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_aa44ff_30_50": {
      "color": "#aa44ff",
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
    "cone_c2ce8b0a": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneRadius": 0.8
    },
    "cone_2ee9462a": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneOpenEnded": true
    },
    "cone_6d96d210": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneThetaLength": 3.142
    },
    "cone_cd80390a": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneOpenEnded": true,
      "coneThetaLength": 1.571
    },
    "cone_cd3da63f": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ],
      "coneRadialSegments": 6
    }
  },
  "objects": [
    {
      "id": "9fa41a78-b9e1-4a18-be0e-9e3ba9f7cc33",
      "name": "Full Cone",
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
      "material": "mat_4488ff_30_50"
    },
    {
      "id": "c2ce8b0a-27e3-4678-8794-a9bef1ec666f",
      "name": "Wide Cone",
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
      "geometry": "cone_c2ce8b0a",
      "material": "mat_44ff88_30_50"
    },
    {
      "id": "2ee9462a-3e18-4bc9-9745-bb4d4d9c3bda",
      "name": "Hollow Cone",
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
      "geometry": "cone_2ee9462a",
      "material": "mat_ff8844_30_50"
    },
    {
      "id": "6d96d210-324b-4982-a4c9-dc7bacc6e4cc",
      "name": "Half Cone",
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
      "geometry": "cone_6d96d210",
      "material": "mat_ffaa00_30_50"
    },
    {
      "id": "cd80390a-dd5b-4d8c-80e6-2ecc97df10a7",
      "name": "Quarter Cone",
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
      "geometry": "cone_cd80390a",
      "material": "mat_ff44aa_30_50"
    },
    {
      "id": "cd3da63f-6811-41ef-b997-c2948a8f91e9",
      "name": "Low Poly Cone",
      "type": "cone",
      "position": [
        6,
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
      "geometry": "cone_cd3da63f",
      "material": "mat_aa44ff_30_50"
    }
  ],
  "roots": [
    "9fa41a78-b9e1-4a18-be0e-9e3ba9f7cc33",
    "c2ce8b0a-27e3-4678-8794-a9bef1ec666f",
    "2ee9462a-3e18-4bc9-9745-bb4d4d9c3bda",
    "6d96d210-324b-4982-a4c9-dc7bacc6e4cc",
    "cd80390a-dd5b-4d8c-80e6-2ecc97df10a7",
    "cd3da63f-6811-41ef-b997-c2948a8f91e9"
  ]
}