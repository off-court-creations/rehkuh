{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "92888775-45c1-4759-8583-c3657502bcea",
    "created": "2026-01-25T20:31:55.741Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Dispersion Test",
    "description": "Tests dispersion for prismatic rainbow effects in transmissive materials"
  },
  "materials": {
    "mat_physical_6b74969d": {
      "type": "physical",
      "color": "#FF0000",
      "metalness": 0,
      "roughness": 0.5
    },
    "mat_physical_5763469d": {
      "type": "physical",
      "color": "#00FF00",
      "metalness": 0,
      "roughness": 0.5
    },
    "mat_physical_22a431c6": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5,
      "dispersion": 0
    },
    "mat_physical_5c77bf9d": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5,
      "dispersion": 0.5
    },
    "mat_physical_22a431c7": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5,
      "dispersion": 1
    },
    "mat_physical_7206bc1d": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "ior": 1.5,
      "dispersion": 1
    },
    "mat_physical_d94e300b": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.8,
      "ior": 2.33,
      "dispersion": 0.8
    },
    "mat_physical_50579d40": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1.2,
      "ior": 2,
      "dispersion": 0.6
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
    },
    "octahedron": {
      "type": "octahedron",
      "args": [
        0.5,
        0
      ]
    }
  },
  "objects": [
    {
      "id": "fc15c608-6385-4bb1-b6c3-f1fdad29925f",
      "name": "reference_red",
      "type": "box",
      "position": [
        -0.4,
        0.25,
        0.4713082458724991
      ],
      "rotation": [
        0,
        0.3,
        0
      ],
      "scale": [
        0.8,
        0.5,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_physical_6b74969d"
    },
    {
      "id": "ba62c73a-24aa-4ca6-bcdb-a22af3044ac2",
      "name": "reference_green",
      "type": "box",
      "position": [
        0.9315801428061732,
        0.25,
        0
      ],
      "rotation": [
        0,
        -0.3,
        0
      ],
      "scale": [
        0.8,
        0.5,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_physical_5763469d"
    },
    {
      "id": "3238be71-b515-4d7a-966f-022c96b2c292",
      "name": "no_dispersion",
      "type": "sphere",
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
      "geometry": "sphere",
      "material": "mat_physical_22a431c6"
    },
    {
      "id": "5c69d0d7-d770-423b-83ae-bd2a26497612",
      "name": "low_dispersion",
      "type": "sphere",
      "position": [
        1.25,
        0.5,
        2.17
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
      "material": "mat_physical_5c77bf9d"
    },
    {
      "id": "f41c0666-2cd6-47bb-be4a-90bab3c9a592",
      "name": "high_dispersion",
      "type": "sphere",
      "position": [
        -1.25,
        0.5,
        2.17
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
      "material": "mat_physical_22a431c7"
    },
    {
      "id": "69fbd015-5e7d-4b10-94ea-ccfe6b5c27c1",
      "name": "prism",
      "type": "cone",
      "position": [
        -2.3955497011005127,
        0.5,
        -0.4953677698437593
      ],
      "rotation": [
        3.1415926535897922,
        -1.2717962332303565,
        -1.570792653589795
      ],
      "scale": [
        1,
        1.5,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "cone",
      "material": "mat_physical_7206bc1d"
    },
    {
      "id": "6c88d4d3-ca4e-451f-a882-e6b7bc79786a",
      "name": "diamond_dispersion",
      "type": "octahedron",
      "position": [
        -1.25,
        0.5,
        -2.17
      ],
      "rotation": [
        0,
        0.5,
        0
      ],
      "scale": [
        0.8,
        0.8,
        0.8
      ],
      "parent": null,
      "visible": true,
      "geometry": "octahedron",
      "material": "mat_physical_d94e300b"
    },
    {
      "id": "ed2dcd9e-721e-4cbb-8640-89a37a07c475",
      "name": "crystal_ball",
      "type": "sphere",
      "position": [
        1.25,
        0.75,
        -2.17
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        1.2,
        1.2,
        1.2
      ],
      "parent": null,
      "visible": true,
      "geometry": "sphere",
      "material": "mat_physical_50579d40"
    }
  ],
  "roots": [
    "fc15c608-6385-4bb1-b6c3-f1fdad29925f",
    "ba62c73a-24aa-4ca6-bcdb-a22af3044ac2",
    "3238be71-b515-4d7a-966f-022c96b2c292",
    "5c69d0d7-d770-423b-83ae-bd2a26497612",
    "f41c0666-2cd6-47bb-be4a-90bab3c9a592",
    "69fbd015-5e7d-4b10-94ea-ccfe6b5c27c1",
    "6c88d4d3-ca4e-451f-a882-e6b7bc79786a",
    "ed2dcd9e-721e-4cbb-8640-89a37a07c475"
  ]
}