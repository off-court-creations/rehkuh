{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "f8d533d1-b4bf-4c84-8eb1-21a872b1e7ac",
    "created": "2026-01-25T20:56:44.475Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Smooth Interpolation",
    "description": "Tests smooth/spline interpolation with ease in/out"
  },
  "materials": {
    "mat_582173c0": {
      "color": "#FF4444",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_f95203c0": {
      "color": "#44FF44",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_751e93c0": {
      "color": "#4444FF",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_992e0480": {
      "color": "#FFFF44",
      "metalness": 0.3,
      "roughness": 0.5
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
    "sphere": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ]
    }
  },
  "objects": [
    {
      "id": "d748e0e6-8c0e-42ee-929e-bd17bd787858",
      "name": "smooth_position",
      "type": "box",
      "position": [
        -4,
        0.5,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.6,
        0.6,
        0.6
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_582173c0"
    },
    {
      "id": "3330e14a-5d74-4431-a4e5-a1ffe44ffb10",
      "name": "smooth_rotation",
      "type": "box",
      "position": [
        0,
        0.5,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        1,
        0.5,
        0.3
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_f95203c0"
    },
    {
      "id": "0d70d022-67bf-4479-9d2d-01dee563164c",
      "name": "smooth_scale",
      "type": "sphere",
      "position": [
        4,
        0.5,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        0.5,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_751e93c0"
    },
    {
      "id": "a88aa91e-43ec-4174-85ac-ffb8d06e6e52",
      "name": "smooth_bounce",
      "type": "sphere",
      "position": [
        0,
        0.5,
        3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        0.5,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_992e0480"
    }
  ],
  "roots": [
    "d748e0e6-8c0e-42ee-929e-bd17bd787858",
    "3330e14a-5d74-4431-a4e5-a1ffe44ffb10",
    "0d70d022-67bf-4479-9d2d-01dee563164c",
    "a88aa91e-43ec-4174-85ac-ffb8d06e6e52"
  ],
  "animations": {
    "clip_smooth_interpolation_tests": {
      "name": "smooth_interpolation_tests",
      "tracks": [
        {
          "target": "d748e0e6-8c0e-42ee-929e-bd17bd787858",
          "path": "position",
          "interpolation": "smooth",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            -4,
            0.5,
            0,
            -4,
            0.5,
            3,
            -4,
            0.5,
            0
          ]
        },
        {
          "target": "3330e14a-5d74-4431-a4e5-a1ffe44ffb10",
          "path": "quaternion",
          "interpolation": "smooth",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0,
            0.7071,
            0,
            0.7071,
            0,
            0,
            0,
            1
          ]
        },
        {
          "target": "0d70d022-67bf-4479-9d2d-01dee563164c",
          "path": "scale",
          "interpolation": "smooth",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0.5,
            0.5,
            0.5,
            1.2,
            1.2,
            1.2,
            0.5,
            0.5,
            0.5
          ]
        },
        {
          "target": "a88aa91e-43ec-4174-85ac-ffb8d06e6e52",
          "path": "position",
          "interpolation": "smooth",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2
          ],
          "values": [
            0,
            0.5,
            3,
            0,
            2.5,
            3,
            0,
            0.5,
            3,
            0,
            2,
            3,
            0,
            0.5,
            3
          ]
        }
      ]
    }
  }
}