{
  "version": "0.9.0",
  "metadata": {
    "name": "Box Demo",
    "created": "2026-01-11T01:14:00.741Z",
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
    "box": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ]
    },
    "box_348219f5": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 8
    },
    "box_0cbd3493": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxHeightSegments": 8
    },
    "box_caf8c7f4": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxDepthSegments": 8
    },
    "box_488174b2": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 4,
      "boxHeightSegments": 4,
      "boxDepthSegments": 4
    },
    "box_099eab26": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 16,
      "boxHeightSegments": 16,
      "boxDepthSegments": 16
    },
    "box_3a36cb35": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 1,
      "boxHeightSegments": 8,
      "boxDepthSegments": 1
    },
    "box_6439c165": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 1,
      "boxHeightSegments": 1,
      "boxDepthSegments": 12
    },
    "box_76af1809": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 10,
      "boxHeightSegments": 10,
      "boxDepthSegments": 1
    }
  },
  "objects": [
    {
      "id": "6a71dc11-d930-4880-b824-78d190d8fd6b",
      "name": "Box Demo",
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
      "id": "ca362d34-ce8d-43fa-8198-df287918844c",
      "name": "Default Box",
      "type": "box",
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
      "geometry": "box",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "348219f5-e6a1-4ae5-870f-7f7d4d962293",
      "name": "Width Segments (8)",
      "type": "box",
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
      "geometry": "box_348219f5",
      "material": "mat_ff6b6b_20_60"
    },
    {
      "id": "0cbd3493-eabf-460b-bb04-394724eede1c",
      "name": "Height Segments (8)",
      "type": "box",
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
      "geometry": "box_0cbd3493",
      "material": "mat_ffd93d_50_30"
    },
    {
      "id": "caf8c7f4-b1c6-4236-aa1a-0f113603a87f",
      "name": "Depth Segments (8)",
      "type": "box",
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
      "geometry": "box_caf8c7f4",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "488174b2-bb53-48e3-b5c0-447669564f04",
      "name": "All Segments (4x4x4)",
      "type": "box",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0.3,
        0.3,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_488174b2",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "099eab26-dc93-4195-9727-a2d084284767",
      "name": "All Segments (16x16x16)",
      "type": "box",
      "position": [
        3,
        0,
        0
      ],
      "rotation": [
        0.3,
        0.3,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_099eab26",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "3a36cb35-7dc6-4d26-b9ec-5bf14b242e81",
      "name": "Wide Panel (1x8x1)",
      "type": "box",
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
        2,
        1,
        0.2
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_3a36cb35",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "6439c165-02c2-4e69-961a-34aa33cd3e25",
      "name": "Tall Column (1x1x12)",
      "type": "box",
      "position": [
        0,
        0.5,
        -3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.3,
        2,
        0.3
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_6439c165",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "76af1809-962e-499f-83b6-eea456bc89b5",
      "name": "Grid Face (10x10x1)",
      "type": "box",
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
        1.5,
        1.5,
        0.1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_76af1809",
      "material": "mat_f39c12_50_30"
    }
  ],
  "roots": [
    "6a71dc11-d930-4880-b824-78d190d8fd6b",
    "ca362d34-ce8d-43fa-8198-df287918844c",
    "348219f5-e6a1-4ae5-870f-7f7d4d962293",
    "0cbd3493-eabf-460b-bb04-394724eede1c",
    "caf8c7f4-b1c6-4236-aa1a-0f113603a87f",
    "488174b2-bb53-48e3-b5c0-447669564f04",
    "099eab26-dc93-4195-9727-a2d084284767",
    "3a36cb35-7dc6-4d26-b9ec-5bf14b242e81",
    "6439c165-02c2-4e69-961a-34aa33cd3e25",
    "76af1809-962e-499f-83b6-eea456bc89b5"
  ]
}