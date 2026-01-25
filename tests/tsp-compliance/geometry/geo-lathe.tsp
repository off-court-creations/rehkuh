{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "b25e4365-80f6-49ab-ad39-6b79d1946f6a",
    "created": "2026-01-25T19:42:24.204Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-lathe",
    "description": "Lathe geometry test: vase, wine glass, chess piece profiles"
  },
  "materials": {
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_d94a4a_30_50": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_4ad94a_30_50": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
    "lathe_a79c09b0": {
      "type": "lathe",
      "points": [
        [
          0,
          0
        ],
        [
          0.5,
          0
        ],
        [
          0.35,
          0.3
        ],
        [
          0.2,
          0.6
        ],
        [
          0.25,
          1
        ],
        [
          0.4,
          1.3
        ],
        [
          0.35,
          1.5
        ],
        [
          0,
          1.5
        ]
      ]
    },
    "lathe_a31909b0": {
      "type": "lathe",
      "points": [
        [
          0,
          0
        ],
        [
          0.4,
          0
        ],
        [
          0.4,
          0.05
        ],
        [
          0.05,
          0.05
        ],
        [
          0.05,
          0.6
        ],
        [
          0.3,
          0.7
        ],
        [
          0.35,
          1
        ],
        [
          0.3,
          1.3
        ],
        [
          0,
          1.3
        ]
      ]
    },
    "lathe_0f5ed099": {
      "type": "lathe",
      "points": [
        [
          0,
          0
        ],
        [
          0.35,
          0
        ],
        [
          0.35,
          0.05
        ],
        [
          0.25,
          0.1
        ],
        [
          0.15,
          0.15
        ],
        [
          0.1,
          0.4
        ],
        [
          0.15,
          0.5
        ],
        [
          0.1,
          0.6
        ],
        [
          0.08,
          0.7
        ],
        [
          0.15,
          0.85
        ],
        [
          0.2,
          1
        ],
        [
          0.15,
          1.15
        ],
        [
          0,
          1.2
        ]
      ]
    }
  },
  "objects": [
    {
      "id": "a79c09b0-c3a4-4b29-aa1d-c6b870d351c9",
      "name": "lathe_vase",
      "type": "lathe",
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
      "geometry": "lathe_a79c09b0",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "a31909b0-aaf8-41c8-b13f-ee6b26423c8a",
      "name": "lathe_wineglass",
      "type": "lathe",
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
      "geometry": "lathe_a31909b0",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "0f5ed099-3aa4-4769-8ac7-47d990424aea",
      "name": "lathe_pawn",
      "type": "lathe",
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
      "geometry": "lathe_0f5ed099",
      "material": "mat_4ad94a_30_50"
    }
  ],
  "roots": [
    "a79c09b0-c3a4-4b29-aa1d-c6b870d351c9",
    "a31909b0-aaf8-41c8-b13f-ee6b26423c8a",
    "0f5ed099-3aa4-4769-8ac7-47d990424aea"
  ]
}