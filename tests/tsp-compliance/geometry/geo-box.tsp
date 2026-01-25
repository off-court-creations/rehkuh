{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "aa2122f1-2f2c-4ce2-a877-942cc8d400e8",
    "created": "2026-01-25T19:18:12.140Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-box",
    "description": "Box geometry test: default args + custom segments (boxWidthSegments, boxHeightSegments, boxDepthSegments)"
  },
  "materials": {
    "mat_4a90d9_30_70": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.7
    },
    "mat_d94a4a_30_70": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.7
    },
    "mat_4ad94a_30_70": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.7
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
    "box_1ed62c34": {
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
    "box_1a7b2704": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ],
      "boxWidthSegments": 8,
      "boxHeightSegments": 2,
      "boxDepthSegments": 1
    }
  },
  "objects": [
    {
      "id": "0471837a-484b-4deb-9e4f-3a65ef263214",
      "name": "box_default",
      "type": "box",
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
      "geometry": "box",
      "material": "mat_4a90d9_30_70"
    },
    {
      "id": "1ed62c34-54b2-44ad-b387-813e8f095d12",
      "name": "box_subdivided",
      "type": "box",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0.3,
        0.5,
        0
      ],
      "scale": [
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_1ed62c34",
      "material": "mat_d94a4a_30_70"
    },
    {
      "id": "1a7b2704-ed10-4836-b49b-79ad3bd495f0",
      "name": "box_asymmetric_segments",
      "type": "box",
      "position": [
        2,
        0,
        0
      ],
      "rotation": [
        0,
        0.3,
        0
      ],
      "scale": [
        2,
        1,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "box_1a7b2704",
      "material": "mat_4ad94a_30_70"
    }
  ],
  "roots": [
    "0471837a-484b-4deb-9e4f-3a65ef263214",
    "1ed62c34-54b2-44ad-b387-813e8f095d12",
    "1a7b2704-ed10-4836-b49b-79ad3bd495f0"
  ]
}