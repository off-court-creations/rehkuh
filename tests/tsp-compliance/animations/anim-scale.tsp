{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "2b9f3b94-d218-4264-a3ba-771e79b5e664",
    "created": "2026-01-25T20:50:26.256Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Scale Test",
    "description": "Tests scale keyframes with smooth interpolation"
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
    "cylinder": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
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
    }
  },
  "objects": [
    {
      "id": "654bb9ee-67d5-4765-a5f4-7ceeee21ac3c",
      "name": "pulsing_sphere",
      "type": "sphere",
      "position": [
        -2.5,
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
      "id": "a20f0d89-0c76-4ea8-9eec-549aebac29bc",
      "name": "stretching_box",
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
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_f95203c0"
    },
    {
      "id": "c026a0e2-7d5d-4c32-b3cc-17e9c5e0b98f",
      "name": "squashing_cylinder",
      "type": "cylinder",
      "position": [
        2.5,
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
      "geometry": "cylinder",
      "material": "mat_751e93c0"
    },
    {
      "id": "e2282b54-5281-40b5-9ddc-a1a2dcf362f2",
      "name": "uniform_torus",
      "type": "torus",
      "position": [
        0,
        0.5,
        3
      ],
      "rotation": [
        1.571,
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
      "geometry": "torus",
      "material": "mat_992e0480"
    }
  ],
  "roots": [
    "654bb9ee-67d5-4765-a5f4-7ceeee21ac3c",
    "a20f0d89-0c76-4ea8-9eec-549aebac29bc",
    "c026a0e2-7d5d-4c32-b3cc-17e9c5e0b98f",
    "e2282b54-5281-40b5-9ddc-a1a2dcf362f2"
  ],
  "animations": {
    "clip_scale_animations": {
      "name": "scale_animations",
      "tracks": [
        {
          "target": "654bb9ee-67d5-4765-a5f4-7ceeee21ac3c",
          "path": "scale",
          "interpolation": "smooth",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            1,
            1,
            1,
            1.5,
            1.5,
            1.5,
            1,
            1,
            1
          ]
        },
        {
          "target": "a20f0d89-0c76-4ea8-9eec-549aebac29bc",
          "path": "scale",
          "interpolation": "smooth",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            1,
            1,
            1,
            0.5,
            2,
            0.5,
            1,
            1,
            1
          ]
        },
        {
          "target": "c026a0e2-7d5d-4c32-b3cc-17e9c5e0b98f",
          "path": "scale",
          "interpolation": "smooth",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2
          ],
          "values": [
            1,
            1,
            1,
            1.3,
            0.5,
            1.3,
            1,
            1,
            1,
            0.7,
            1.5,
            0.7,
            1,
            1,
            1
          ]
        },
        {
          "target": "e2282b54-5281-40b5-9ddc-a1a2dcf362f2",
          "path": "scale",
          "interpolation": "smooth",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2
          ],
          "values": [
            0.5,
            0.5,
            0.5,
            1,
            1,
            1,
            1.5,
            1.5,
            1.5,
            1,
            1,
            1,
            0.5,
            0.5,
            0.5
          ]
        }
      ]
    }
  }
}