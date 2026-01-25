{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "06dd968b-1161-4154-b779-cfa881fea9bb",
    "created": "2026-01-25T19:48:23.395Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-polyhedron",
    "description": "Polyhedron geometry test: custom polyhedron with raw vertices/indices"
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
    }
  },
  "geometries": {
    "polyhedron_3df62312": {
      "type": "polyhedron",
      "vertices": [
        0,
        1,
        0,
        -1,
        -1,
        1,
        1,
        -1,
        1,
        1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "indices": [
        0,
        1,
        2,
        0,
        2,
        3,
        0,
        3,
        4,
        0,
        4,
        1,
        1,
        3,
        2,
        1,
        4,
        3
      ]
    },
    "polyhedron_98fee79b": {
      "type": "polyhedron",
      "vertices": [
        0,
        1,
        0.577,
        -0.5,
        1,
        -0.289,
        0.5,
        1,
        -0.289,
        0,
        -1,
        0.577,
        -0.5,
        -1,
        -0.289,
        0.5,
        -1,
        -0.289
      ],
      "indices": [
        0,
        2,
        1,
        3,
        4,
        5,
        0,
        1,
        4,
        0,
        4,
        3,
        1,
        2,
        5,
        1,
        5,
        4,
        2,
        0,
        3,
        2,
        3,
        5
      ]
    }
  },
  "objects": [
    {
      "id": "3df62312-545f-4b13-a014-70ef7c981d0a",
      "name": "polyhedron_pyramid",
      "type": "polyhedron",
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
      "geometry": "polyhedron_3df62312",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "98fee79b-2c3d-4af2-9f73-60795f898a1c",
      "name": "polyhedron_prism",
      "type": "polyhedron",
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
      "geometry": "polyhedron_98fee79b",
      "material": "mat_d94a4a_30_50"
    }
  ],
  "roots": [
    "3df62312-545f-4b13-a014-70ef7c981d0a",
    "98fee79b-2c3d-4af2-9f73-60795f898a1c"
  ]
}