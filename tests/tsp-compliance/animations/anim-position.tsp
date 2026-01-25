{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "3da725e7-bc35-45b8-bfa1-5f1fe88f7aa0",
    "created": "2026-01-25T20:48:30.238Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Position Test",
    "description": "Tests position keyframes with linear interpolation"
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
    "mat_fc61cb47": {
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 1
    }
  },
  "geometries": {
    "sphere": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ]
    },
    "box": {
      "type": "box",
      "args": [
        1,
        1,
        1
      ]
    },
    "torus": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ]
    },
    "cylinder": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ]
    }
  },
  "objects": [
    {
      "id": "a9851bb9-fb0d-4403-ade1-351d2260b63d",
      "name": "moving_sphere",
      "type": "sphere",
      "position": [
        -3,
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
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_582173c0"
    },
    {
      "id": "438a0454-9435-45fe-95e6-11028838beb0",
      "name": "bouncing_box",
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
        0.8,
        0.8,
        0.8
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_f95203c0"
    },
    {
      "id": "a5814ab6-c471-40c9-9568-6c90da96f645",
      "name": "circling_torus",
      "type": "torus",
      "position": [
        2,
        0.5,
        0
      ],
      "rotation": [
        1.5708,
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
      "geometry": "torus",
      "material": "mat_751e93c0"
    },
    {
      "id": "2482ed45-db86-45bc-80ee-02a5dc399725",
      "name": "reference_marker",
      "type": "cylinder",
      "position": [
        0,
        0.05,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.1,
        0.1,
        0.1
      ],
      "parent": null,
      "visible": true,
      "geometry": "cylinder",
      "material": "mat_fc61cb47"
    }
  ],
  "roots": [
    "a9851bb9-fb0d-4403-ade1-351d2260b63d",
    "438a0454-9435-45fe-95e6-11028838beb0",
    "a5814ab6-c471-40c9-9568-6c90da96f645",
    "2482ed45-db86-45bc-80ee-02a5dc399725"
  ],
  "animations": {
    "clip_position_animations": {
      "name": "position_animations",
      "tracks": [
        {
          "target": "a9851bb9-fb0d-4403-ade1-351d2260b63d",
          "path": "position",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2,
            3,
            4
          ],
          "values": [
            -3,
            0.5,
            0,
            3,
            0.5,
            0,
            3,
            0.5,
            3,
            -3,
            0.5,
            3,
            -3,
            0.5,
            0
          ]
        },
        {
          "target": "438a0454-9435-45fe-95e6-11028838beb0",
          "path": "position",
          "interpolation": "linear",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2,
            2.5,
            3,
            3.5,
            4
          ],
          "values": [
            0,
            0.5,
            0,
            0,
            2,
            0,
            0,
            0.5,
            0,
            0,
            2,
            0,
            0,
            0.5,
            0,
            0,
            2,
            0,
            0,
            0.5,
            0,
            0,
            2,
            0,
            0,
            0.5,
            0
          ]
        },
        {
          "target": "a5814ab6-c471-40c9-9568-6c90da96f645",
          "path": "position",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2,
            3,
            4
          ],
          "values": [
            2,
            0.5,
            0,
            0,
            0.5,
            2,
            -2,
            0.5,
            0,
            0,
            0.5,
            -2,
            2,
            0.5,
            0
          ]
        }
      ]
    }
  }
}