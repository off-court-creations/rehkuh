{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "343ad9b0-bca9-4ef8-9ecb-7283cf695a76",
    "created": "2026-01-25T19:31:00.228Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-cylinder",
    "description": "Cylinder geometry test: tapered, open-ended, partial theta, hexagonal prism"
  },
  "materials": {
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_d94a4a_30_50": {
      "color": "#d94a4a",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_4ad94a_30_50": {
      "color": "#4ad94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_d9d94a_30_50": {
      "color": "#d9d94a",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
    },
    "mat_9b5de5_30_50": {
      "color": "#9b5de5",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_ff6b35_30_50": {
      "color": "#ff6b35",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
    "cylinder": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ]
    },
    "cylinder_d8ddfa18": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadiusTop": 0.2,
      "cylinderRadiusBottom": 0.5
    },
    "cylinder_a2922f97": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderOpenEnded": true
    },
    "cylinder_8c7d2999": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderThetaLength": 4.7124
    },
    "cylinder_0c267a3e": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadialSegments": 6
    },
    "cylinder_bfa12ea9": {
      "type": "cylinder",
      "args": [
        0.5,
        0.5,
        1,
        32
      ],
      "cylinderRadiusTop": 0,
      "cylinderRadiusBottom": 0.5
    }
  },
  "objects": [
    {
      "id": "abbe6c91-510b-46e3-8229-540d6af22d71",
      "name": "cylinder_default",
      "type": "cylinder",
      "position": [
        -4,
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
      "geometry": "cylinder",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "d8ddfa18-1fc8-4553-b7b7-dbb8c1c0c153",
      "name": "cylinder_tapered",
      "type": "cylinder",
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
      "geometry": "cylinder_d8ddfa18",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "a2922f97-199e-4bae-92d3-f62425d45dc8",
      "name": "cylinder_open",
      "type": "cylinder",
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
      "geometry": "cylinder_a2922f97",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "8c7d2999-a722-44d3-a626-5cc277b70efc",
      "name": "cylinder_partial",
      "type": "cylinder",
      "position": [
        2,
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
      "geometry": "cylinder_8c7d2999",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "0c267a3e-2a21-4ff6-9e13-f00e64e0105b",
      "name": "cylinder_hexprism",
      "type": "cylinder",
      "position": [
        4,
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
      "geometry": "cylinder_0c267a3e",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "bfa12ea9-b81a-44f1-9951-31ca2ee480e1",
      "name": "cylinder_cone_style",
      "type": "cylinder",
      "position": [
        0,
        2,
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
      "geometry": "cylinder_bfa12ea9",
      "material": "mat_ff6b35_30_50"
    }
  ],
  "roots": [
    "abbe6c91-510b-46e3-8229-540d6af22d71",
    "d8ddfa18-1fc8-4553-b7b7-dbb8c1c0c153",
    "a2922f97-199e-4bae-92d3-f62425d45dc8",
    "8c7d2999-a722-44d3-a626-5cc277b70efc",
    "0c267a3e-2a21-4ff6-9e13-f00e64e0105b",
    "bfa12ea9-b81a-44f1-9951-31ca2ee480e1"
  ]
}