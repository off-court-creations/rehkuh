{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "37ee0ff9-3f8a-42f4-8e97-836981a830c7",
    "created": "2026-01-25T20:53:50.233Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Visibility Test",
    "description": "Tests visibility toggle with discrete interpolation"
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
    "mat_ccf026cf": {
      "color": "#FFFFFF",
      "metalness": 0.1,
      "roughness": 0.8
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
    }
  },
  "objects": [
    {
      "id": "fb1819a9-e961-43f7-bd40-9bfdf132d64b",
      "name": "blink_fast",
      "type": "sphere",
      "position": [
        -3,
        1,
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
      "geometry": "sphere",
      "material": "mat_582173c0"
    },
    {
      "id": "15edbd0c-63df-4c19-9131-3cdbb2a1f744",
      "name": "blink_slow",
      "type": "sphere",
      "position": [
        0,
        1,
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
      "geometry": "sphere",
      "material": "mat_f95203c0"
    },
    {
      "id": "6c7351b3-b043-4069-9b55-587cb514878a",
      "name": "blink_once",
      "type": "sphere",
      "position": [
        3,
        1,
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
      "geometry": "sphere",
      "material": "mat_751e93c0"
    },
    {
      "id": "d77d1ac7-0ef4-4d7f-b578-2bd9bf2ba197",
      "name": "always_visible",
      "type": "box",
      "position": [
        0,
        1,
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
      "geometry": "box",
      "material": "mat_ccf026cf"
    }
  ],
  "roots": [
    "fb1819a9-e961-43f7-bd40-9bfdf132d64b",
    "15edbd0c-63df-4c19-9131-3cdbb2a1f744",
    "6c7351b3-b043-4069-9b55-587cb514878a",
    "d77d1ac7-0ef4-4d7f-b578-2bd9bf2ba197"
  ],
  "animations": {
    "clip_visibility_animations": {
      "name": "visibility_animations",
      "tracks": [
        {
          "target": "fb1819a9-e961-43f7-bd40-9bfdf132d64b",
          "path": "visible",
          "interpolation": "discrete",
          "times": [
            0,
            0.25,
            0.5,
            0.75,
            1,
            1.25,
            1.5,
            1.75,
            2
          ],
          "values": [
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            true
          ]
        },
        {
          "target": "15edbd0c-63df-4c19-9131-3cdbb2a1f744",
          "path": "visible",
          "interpolation": "discrete",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2
          ],
          "values": [
            true,
            false,
            true,
            false,
            true
          ]
        },
        {
          "target": "6c7351b3-b043-4069-9b55-587cb514878a",
          "path": "visible",
          "interpolation": "discrete",
          "times": [
            0,
            0.8,
            1.2,
            2
          ],
          "values": [
            true,
            false,
            true,
            true
          ]
        }
      ]
    }
  }
}