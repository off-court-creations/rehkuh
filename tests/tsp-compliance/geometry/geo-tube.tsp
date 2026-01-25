{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "daf6834d-8e3a-448c-978f-87b5bfa9e2d5",
    "created": "2026-01-25T19:46:28.935Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-tube",
    "description": "Tube geometry test: catmullRom, cubicBezier, quadraticBezier, line curves"
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
    "tube_c8822d04": {
      "type": "tube",
      "path": {
        "curveType": "catmullRom",
        "points": [
          [
            0,
            0,
            0
          ],
          [
            0.3,
            0.5,
            0
          ],
          [
            0,
            1,
            0.3
          ],
          [
            -0.3,
            1.5,
            0
          ],
          [
            0,
            2,
            0
          ]
        ],
        "closed": false,
        "tension": 0.5
      },
      "tubeRadius": 0.08,
      "tubeTubularSegments": 64,
      "tubeRadialSegments": 8
    },
    "tube_ef9dec13": {
      "type": "tube",
      "path": {
        "curveType": "cubicBezier",
        "v0": [
          0,
          0,
          0
        ],
        "v1": [
          0.5,
          0.5,
          0
        ],
        "v2": [
          -0.5,
          1.5,
          0
        ],
        "v3": [
          0,
          2,
          0
        ]
      },
      "tubeRadius": 0.08,
      "tubeTubularSegments": 64,
      "tubeRadialSegments": 8
    },
    "tube_c5386c4b": {
      "type": "tube",
      "path": {
        "curveType": "quadraticBezier",
        "v0": [
          0,
          0,
          0
        ],
        "v1": [
          0.5,
          1,
          0
        ],
        "v2": [
          0,
          2,
          0
        ]
      },
      "tubeRadius": 0.08,
      "tubeTubularSegments": 64,
      "tubeRadialSegments": 8
    },
    "tube_6ff635e5": {
      "type": "tube",
      "path": {
        "curveType": "line",
        "v1": [
          0,
          0,
          0
        ],
        "v2": [
          0,
          2,
          0
        ]
      },
      "tubeRadius": 0.08,
      "tubeTubularSegments": 8,
      "tubeRadialSegments": 8
    }
  },
  "objects": [
    {
      "id": "c8822d04-569d-425e-8b5f-21c1c91e8367",
      "name": "tube_catmullrom",
      "type": "tube",
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
      "geometry": "tube_c8822d04",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "ef9dec13-2e91-4472-805f-fa897f5752be",
      "name": "tube_cubicbezier",
      "type": "tube",
      "position": [
        -1.5,
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
      "geometry": "tube_ef9dec13",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "c5386c4b-a397-4ef5-8816-614023adfa23",
      "name": "tube_quadraticbezier",
      "type": "tube",
      "position": [
        1.5,
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
      "geometry": "tube_c5386c4b",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "6ff635e5-c0c6-481a-980c-de503d14ab9a",
      "name": "tube_line",
      "type": "tube",
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
      "geometry": "tube_6ff635e5",
      "material": "mat_9b5de5_30_50"
    }
  ],
  "roots": [
    "c8822d04-569d-425e-8b5f-21c1c91e8367",
    "ef9dec13-2e91-4472-805f-fa897f5752be",
    "c5386c4b-a397-4ef5-8816-614023adfa23",
    "6ff635e5-c0c6-481a-980c-de503d14ab9a"
  ]
}