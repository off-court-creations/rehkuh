{
  "version": "0.9.0",
  "metadata": {
    "name": "scene",
    "created": "2026-01-11T01:00:32.748Z",
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
    },
    "mat_44ffff_30_50": {
      "color": "#44ffff",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
    "cylinder": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ]
    },
    "cylinder_2741c8c0": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadiusTop": 0.2,
      "cylinderRadiusBottom": 0.5
    },
    "cylinder_4a21ba45": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true
    },
    "cylinder_403a458e": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderThetaLength": 3.142
    },
    "cylinder_ae5c2d9e": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true,
      "cylinderThetaLength": 1.571
    },
    "cylinder_94982613": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadialSegments": 6
    },
    "cylinder_11f0d02a": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadiusTop": 0.7,
      "cylinderRadiusBottom": 0.3
    }
  },
  "objects": [
    {
      "id": "6fd72d77-faa7-44b6-a854-5abe61eac6f0",
      "name": "Full Cylinder",
      "type": "cylinder",
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
      "geometry": "cylinder",
      "material": "mat_4488ff_30_50"
    },
    {
      "id": "2741c8c0-7971-437c-b88c-9b9296df6bb1",
      "name": "Tapered (Cone-like)",
      "type": "cylinder",
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
      "geometry": "cylinder_2741c8c0",
      "material": "mat_44ff88_30_50"
    },
    {
      "id": "4a21ba45-c020-4b13-9f9e-7ddeae2aae4f",
      "name": "Pipe (Open Ended)",
      "type": "cylinder",
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
      "geometry": "cylinder_4a21ba45",
      "material": "mat_ff8844_30_50"
    },
    {
      "id": "403a458e-2068-4a5a-ae28-ce66334fe189",
      "name": "Half Cylinder",
      "type": "cylinder",
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
      "geometry": "cylinder_403a458e",
      "material": "mat_ffaa00_30_50"
    },
    {
      "id": "ae5c2d9e-4495-4d40-b83f-127cebc65042",
      "name": "Quarter Pipe",
      "type": "cylinder",
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
      "geometry": "cylinder_ae5c2d9e",
      "material": "mat_ff44aa_30_50"
    },
    {
      "id": "94982613-f461-4d6c-a9c9-1eea7006cb58",
      "name": "Low Poly Cylinder",
      "type": "cylinder",
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
      "geometry": "cylinder_94982613",
      "material": "mat_aa44ff_30_50"
    },
    {
      "id": "11f0d02a-37f3-4547-8474-6853464de9c4",
      "name": "Flared Cylinder",
      "type": "cylinder",
      "position": [
        8,
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
      "geometry": "cylinder_11f0d02a",
      "material": "mat_44ffff_30_50"
    }
  ],
  "roots": [
    "6fd72d77-faa7-44b6-a854-5abe61eac6f0",
    "2741c8c0-7971-437c-b88c-9b9296df6bb1",
    "4a21ba45-c020-4b13-9f9e-7ddeae2aae4f",
    "403a458e-2068-4a5a-ae28-ce66334fe189",
    "ae5c2d9e-4495-4d40-b83f-127cebc65042",
    "94982613-f461-4d6c-a9c9-1eea7006cb58",
    "11f0d02a-37f3-4547-8474-6853464de9c4"
  ]
}