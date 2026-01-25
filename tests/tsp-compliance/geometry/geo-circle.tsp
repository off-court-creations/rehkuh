{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "28b8cf6e-fc00-42e0-9df2-8b1dbf931bd9",
    "created": "2026-01-25T19:37:08.209Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-circle",
    "description": "Circle geometry test: hexagon, pac-man (partial theta)"
  },
  "materials": {
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_d94a4a_30_50": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_d9d94a_30_50": {
      "color": "#d9d94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_4ad94a_30_50": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_9b5de5_30_50": {
      "color": "#9b5de5",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
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
    "circle_b314b176": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 6
    },
    "circle_5054d3a3": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleThetaStart": 0.5236,
      "circleThetaLength": 5.236
    },
    "circle_402e370b": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleSegments": 3
    },
    "circle_5768ac49": {
      "type": "circle",
      "args": [
        0.5,
        32
      ],
      "circleThetaLength": 3.14159
    }
  },
  "objects": [
    {
      "id": "4038b7a1-c472-4e2f-9dd0-4b0b414595b3",
      "name": "circle_default",
      "type": "circle",
      "position": [
        -3,
        0,
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
      "parent": null,
      "visible": true,
      "geometry": "circle",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "b314b176-bcc7-43b1-a35a-b47b74870811",
      "name": "circle_hexagon",
      "type": "circle",
      "position": [
        0,
        0,
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
      "parent": null,
      "visible": true,
      "geometry": "circle_b314b176",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "5054d3a3-7d5c-460c-910e-4d5bbfa4a144",
      "name": "circle_pacman",
      "type": "circle",
      "position": [
        3,
        0,
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
      "parent": null,
      "visible": true,
      "geometry": "circle_5054d3a3",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "402e370b-1903-4255-a9a5-72a8bca21aa4",
      "name": "circle_triangle",
      "type": "circle",
      "position": [
        -1.5,
        2,
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
      "parent": null,
      "visible": true,
      "geometry": "circle_402e370b",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "5768ac49-2225-4179-a3b4-79501ebe6ea7",
      "name": "circle_semicircle",
      "type": "circle",
      "position": [
        1.5,
        2,
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
      "parent": null,
      "visible": true,
      "geometry": "circle_5768ac49",
      "material": "mat_9b5de5_30_50"
    }
  ],
  "roots": [
    "4038b7a1-c472-4e2f-9dd0-4b0b414595b3",
    "b314b176-bcc7-43b1-a35a-b47b74870811",
    "5054d3a3-7d5c-460c-910e-4d5bbfa4a144",
    "402e370b-1903-4255-a9a5-72a8bca21aa4",
    "5768ac49-2225-4179-a3b4-79501ebe6ea7"
  ]
}