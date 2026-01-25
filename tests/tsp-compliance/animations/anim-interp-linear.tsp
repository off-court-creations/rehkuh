{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "1bdc34bb-380c-4288-bc14-4a4ffee875a8",
    "created": "2026-01-25T20:55:54.025Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Linear Interpolation",
    "description": "Tests linear interpolation with constant speed movement"
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
    },
    "cone": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ]
    }
  },
  "objects": [
    {
      "id": "8abdd460-5188-4b27-b575-ccf038a5170e",
      "name": "linear_position",
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
      "id": "2cb3b9db-81d2-4917-b0ef-2402fdfd456a",
      "name": "linear_rotation",
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
      "id": "836de996-b757-4271-b500-ef27addbcba6",
      "name": "linear_scale",
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
      "id": "4c6f0c61-d1e0-47ff-9f72-c22e76f4bad6",
      "name": "linear_combined",
      "type": "cone",
      "position": [
        0,
        0.5,
        1
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        1,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "cone",
      "material": "mat_992e0480"
    }
  ],
  "roots": [
    "8abdd460-5188-4b27-b575-ccf038a5170e",
    "2cb3b9db-81d2-4917-b0ef-2402fdfd456a",
    "836de996-b757-4271-b500-ef27addbcba6",
    "4c6f0c61-d1e0-47ff-9f72-c22e76f4bad6"
  ],
  "animations": {
    "clip_linear_interpolation_tests": {
      "name": "linear_interpolation_tests",
      "tracks": [
        {
          "target": "8abdd460-5188-4b27-b575-ccf038a5170e",
          "path": "position",
          "interpolation": "linear",
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
          "target": "2cb3b9db-81d2-4917-b0ef-2402fdfd456a",
          "path": "quaternion",
          "interpolation": "linear",
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
          "target": "836de996-b757-4271-b500-ef27addbcba6",
          "path": "scale",
          "interpolation": "linear",
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
          "target": "4c6f0c61-d1e0-47ff-9f72-c22e76f4bad6",
          "path": "position",
          "interpolation": "linear",
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
            1,
            -2,
            0.5,
            3,
            0,
            0.5,
            5,
            2,
            0.5,
            3,
            0,
            0.5,
            1
          ]
        }
      ]
    }
  }
}