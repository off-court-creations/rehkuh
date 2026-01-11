{
  "version": "0.9.0",
  "metadata": {
    "name": "Circle Demo",
    "created": "2026-01-11T03:17:55.301Z",
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
    "circle": {
      "type": "circle",
      "args": [
        0.5,
        32
      ]
    },
    "circle_9525d592": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleRadius": 1.5
    },
    "circle_ae33a628": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 8
    },
    "circle_85adae56": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 3
    },
    "circle_ce34c348": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 4
    },
    "circle_2b28a7ec": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 6
    },
    "circle_3037687d": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleThetaLength": 3.14159
    },
    "circle_86847bf7": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleThetaLength": 1.5708
    },
    "circle_70a4d830": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 32,
      "circleThetaStart": 0.3927,
      "circleThetaLength": 5.4978
    }
  },
  "objects": [
    {
      "id": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "name": "Circle Demo",
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
      "id": "089155cc-be40-4bd2-b18d-18acbea3051a",
      "name": "Default Circle",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle",
      "material": "mat_4bd0d2_30_40"
    },
    {
      "id": "9525d592-4b31-4442-ae01-c8ab283b22fa",
      "name": "Large Radius (1.5)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_9525d592",
      "material": "mat_ff6b6b_20_60"
    },
    {
      "id": "ae33a628-2d63-49f7-9745-4eb1f09deb1e",
      "name": "Low Segments (8)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_ae33a628",
      "material": "mat_ffd93d_50_30"
    },
    {
      "id": "85adae56-0234-4a91-ab5b-d5ae4fcd8f24",
      "name": "Triangle (3 segs)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_85adae56",
      "material": "mat_6bcb77_30_50"
    },
    {
      "id": "ce34c348-b237-4625-a629-b201e05e7dc6",
      "name": "Square (4 segs)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_ce34c348",
      "material": "mat_4d96ff_40_40"
    },
    {
      "id": "2b28a7ec-cdbc-44d6-ae7f-d13971b9cc75",
      "name": "Hexagon (6 segs)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_2b28a7ec",
      "material": "mat_9b59b6_30_50"
    },
    {
      "id": "3037687d-b5a7-40ab-9907-5fe629e7fa2b",
      "name": "Half Circle (π)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_3037687d",
      "material": "mat_e74c3c_20_60"
    },
    {
      "id": "86847bf7-97f8-4740-912d-d31baee6f6dc",
      "name": "Quarter Circle (π/2)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_86847bf7",
      "material": "mat_1abc9c_40_40"
    },
    {
      "id": "70a4d830-2710-4b2f-90bb-b1258af58999",
      "name": "Pac-Man (270°)",
      "type": "circle",
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
      "parent": "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c",
      "visible": true,
      "geometry": "circle_70a4d830",
      "material": "mat_f39c12_50_30"
    }
  ],
  "roots": [
    "e4ac8c50-a8e0-4a6d-b463-1555d5a6003c"
  ]
}