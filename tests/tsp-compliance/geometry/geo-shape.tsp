{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "148bf874-f481-428d-8fa4-8e4b98d1b562",
    "created": "2026-01-25T19:44:52.729Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-shape",
    "description": "Shape geometry test: triangle, custom polygon, shape with holes"
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
    "shape_206dd7cd": {
      "type": "shape",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": 0,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": -0.5,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": 0.5,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": 0,
            "y": 0.5
          }
        ]
      }
    },
    "shape_3f182dde": {
      "type": "shape",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": 0,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": -0.475,
            "y": 0.155
          },
          {
            "op": "lineTo",
            "x": -0.295,
            "y": -0.405
          },
          {
            "op": "lineTo",
            "x": 0.295,
            "y": -0.405
          },
          {
            "op": "lineTo",
            "x": 0.475,
            "y": 0.155
          },
          {
            "op": "lineTo",
            "x": 0,
            "y": 0.5
          }
        ]
      }
    },
    "shape_a8c075e5": {
      "type": "shape",
      "shape": {
        "commands": [
          {
            "op": "moveTo",
            "x": -0.5,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": 0.5,
            "y": -0.5
          },
          {
            "op": "lineTo",
            "x": 0.5,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": -0.5,
            "y": 0.5
          },
          {
            "op": "lineTo",
            "x": -0.5,
            "y": -0.5
          }
        ],
        "holes": [
          [
            {
              "op": "moveTo",
              "x": -0.2,
              "y": -0.2
            },
            {
              "op": "lineTo",
              "x": -0.2,
              "y": 0.2
            },
            {
              "op": "lineTo",
              "x": 0.2,
              "y": 0.2
            },
            {
              "op": "lineTo",
              "x": 0.2,
              "y": -0.2
            },
            {
              "op": "lineTo",
              "x": -0.2,
              "y": -0.2
            }
          ]
        ]
      }
    }
  },
  "objects": [
    {
      "id": "206dd7cd-2f4d-43b7-bdf5-313081e71433",
      "name": "shape_triangle",
      "type": "shape",
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
      "geometry": "shape_206dd7cd",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "3f182dde-510f-451f-aa46-a51b751a9749",
      "name": "shape_pentagon",
      "type": "shape",
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
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "shape_3f182dde",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "a8c075e5-e09a-4022-a5a0-c54d567ff322",
      "name": "shape_with_hole",
      "type": "shape",
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
        1,
        1,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "shape_a8c075e5",
      "material": "mat_4ad94a_30_50"
    }
  ],
  "roots": [
    "206dd7cd-2f4d-43b7-bdf5-313081e71433",
    "3f182dde-510f-451f-aa46-a51b751a9749",
    "a8c075e5-e09a-4022-a5a0-c54d567ff322"
  ]
}