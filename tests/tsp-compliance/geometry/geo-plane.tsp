{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "b8e72aef-7e80-4c3f-8464-9feccfe57046",
    "created": "2026-01-25T19:35:31.097Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-plane",
    "description": "Plane geometry test: default and custom subdivisions"
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
    }
  },
  "geometries": {
    "plane": {
      "type": "plane",
      "args": [
        1,
        1
      ]
    },
    "plane_bfe0e641": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 8,
      "planeHeightSegments": 8
    },
    "plane_4d668e58": {
      "type": "plane",
      "args": [
        1,
        1
      ],
      "planeWidthSegments": 12,
      "planeHeightSegments": 4
    }
  },
  "objects": [
    {
      "id": "2632d2ad-c566-4ea6-b552-e74de0565c6f",
      "name": "plane_default",
      "type": "plane",
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
      "geometry": "plane",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "bfe0e641-f721-4d78-97bd-2eb9fd475bc4",
      "name": "plane_subdivided",
      "type": "plane",
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
        2,
        2,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane_bfe0e641",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "4d668e58-136c-4ffa-b9d4-de39dab05262",
      "name": "plane_asymmetric",
      "type": "plane",
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
        1.5,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane_4d668e58",
      "material": "mat_4ad94a_30_50"
    }
  ],
  "roots": [
    "2632d2ad-c566-4ea6-b552-e74de0565c6f",
    "bfe0e641-f721-4d78-97bd-2eb9fd475bc4",
    "4d668e58-136c-4ffa-b9d4-de39dab05262"
  ]
}