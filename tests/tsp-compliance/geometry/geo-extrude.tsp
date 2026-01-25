{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "56ef3258-86ad-407e-aeb0-b5bbc145477c",
    "created": "2026-01-25T19:43:50.049Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-extrude",
    "description": "Extrude geometry test: heart, star, text-like shape with bevel options"
  },
  "materials": {
    "mat_d94a4a_30_50": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_d9d94a_30_50": {
      "color": "#d9d94a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
    "extrude_95cbcc4c": {
      "type": "extrude",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": 0,
            "y": 0.5
          },
          {
            "op": "bezierCurveTo",
            "cp1x": 0,
            "cp1y": 0.8,
            "cp2x": -0.5,
            "cp2y": 1,
            "x": -0.5,
            "y": 0.5
          },
          {
            "op": "bezierCurveTo",
            "cp1x": -0.5,
            "cp1y": 0,
            "cp2x": 0,
            "cp2y": 0,
            "x": 0,
            "y": -0.5
          },
          {
            "op": "bezierCurveTo",
            "cp1x": 0,
            "cp1y": 0,
            "cp2x": 0.5,
            "cp2y": 0,
            "x": 0.5,
            "y": 0.5
          },
          {
            "op": "bezierCurveTo",
            "cp1x": 0.5,
            "cp1y": 1,
            "cp2x": 0,
            "cp2y": 0.8,
            "x": 0,
            "y": 0.5
          }
        ]
      },
      "extrudeOptions": {
        "depth": 0.3,
        "bevelEnabled": true,
        "bevelThickness": 0.05,
        "bevelSize": 0.05,
        "bevelSegments": 3
      }
    },
    "extrude_a155c000": {
      "type": "extrude",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": 0,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": 0.15,
            "y": 0.15
          },
          {
            "op": "lineTo",
            "x": 0.5,
            "y": 0.15
          },
          {
            "op": "lineTo",
            "x": 0.2,
            "y": -0.1
          },
          {
            "op": "lineTo",
            "x": 0.3,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": 0,
            "y": -0.25
          },
          {
            "op": "lineTo",
            "x": -0.3,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": -0.2,
            "y": -0.1
          },
          {
            "op": "lineTo",
            "x": -0.5,
            "y": 0.15
          },
          {
            "op": "lineTo",
            "x": -0.15,
            "y": 0.15
          },
          {
            "op": "lineTo",
            "x": 0,
            "y": 0.5
          }
        ]
      },
      "extrudeOptions": {
        "depth": 0.2,
        "bevelEnabled": true,
        "bevelThickness": 0.03,
        "bevelSize": 0.03,
        "bevelSegments": 2
      }
    },
    "extrude_57d0ba4a": {
      "type": "extrude",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": -0.4,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": 0.4,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": 0.4,
            "y": 0.35
          },
          {
            "op": "lineTo",
            "x": 0.1,
            "y": 0.35
          },
          {
            "op": "lineTo",
            "x": 0.1,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": -0.1,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": -0.1,
            "y": 0.35
          },
          {
            "op": "lineTo",
            "x": -0.4,
            "y": 0.35
          },
          {
            "op": "lineTo",
            "x": -0.4,
            "y": 0.5
          }
        ]
      },
      "extrudeOptions": {
        "depth": 0.15,
        "bevelEnabled": false
      }
    }
  },
  "objects": [
    {
      "id": "95cbcc4c-8ac3-4ea3-8cbe-e173c3532912",
      "name": "extrude_heart",
      "type": "extrude",
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
      "geometry": "extrude_95cbcc4c",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "a155c000-756d-4873-9534-e96b3ec36d06",
      "name": "extrude_star",
      "type": "extrude",
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
      "geometry": "extrude_a155c000",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "57d0ba4a-aef8-4e19-bd54-cf463ab3485b",
      "name": "extrude_letter_T",
      "type": "extrude",
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
      "geometry": "extrude_57d0ba4a",
      "material": "mat_4a90d9_30_50"
    }
  ],
  "roots": [
    "95cbcc4c-8ac3-4ea3-8cbe-e173c3532912",
    "a155c000-756d-4873-9534-e96b3ec36d06",
    "57d0ba4a-aef8-4e19-bd54-cf463ab3485b"
  ]
}