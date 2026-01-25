{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "293ce27a-1da8-4803-ae5a-87a5574945a5",
    "created": "2026-01-25T19:20:38.482Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-sphere",
    "description": "Sphere geometry test: partial params (phiStart, phiLength, thetaStart, thetaLength) - hemisphere, wedge, dome"
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
      "roughness": 0.5
    },
    "mat_d9d94a_30_50": {
      "color": "#d9d94a",
      "metalness": 0.3,
      "roughness": 0.5
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
    "sphere": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ]
    },
    "sphere_0fd1455a": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereThetaLength": 1.5708
    },
    "sphere_49644a67": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereThetaStart": 1.5708,
      "sphereThetaLength": 1.5708
    },
    "sphere_b14d709c": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiLength": 3.1416
    },
    "sphere_84e4736b": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "spherePhiLength": 1.5708,
      "sphereThetaLength": 1.5708
    },
    "sphere_a935ccdb": {
      "type": "sphere",
      "args": [
        0.5,
        32,
        32
      ],
      "sphereWidthSegments": 8,
      "sphereHeightSegments": 6
    }
  },
  "objects": [
    {
      "id": "ca066b58-2052-4967-af68-f5b7a7b5bfcc",
      "name": "sphere_default",
      "type": "sphere",
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
      "geometry": "sphere",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "0fd1455a-d9a1-47dc-8b2e-cc2fcd711c78",
      "name": "sphere_dome",
      "type": "sphere",
      "position": [
        -1,
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
      "geometry": "sphere_0fd1455a",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "49644a67-db55-4701-aab1-6679259b654c",
      "name": "sphere_bowl",
      "type": "sphere",
      "position": [
        1,
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
      "geometry": "sphere_49644a67",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "b14d709c-080e-4fd9-ac99-df9612294fc7",
      "name": "sphere_wedge",
      "type": "sphere",
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
      "geometry": "sphere_b14d709c",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "84e4736b-35fc-4d5b-9c49-31b0ae12f858",
      "name": "sphere_quarter",
      "type": "sphere",
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
      "geometry": "sphere_84e4736b",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "a935ccdb-99ce-486e-b5bc-4f083e526e33",
      "name": "sphere_lowpoly",
      "type": "sphere",
      "position": [
        0,
        -2,
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
      "geometry": "sphere_a935ccdb",
      "material": "mat_ff6b35_30_50"
    }
  ],
  "roots": [
    "ca066b58-2052-4967-af68-f5b7a7b5bfcc",
    "0fd1455a-d9a1-47dc-8b2e-cc2fcd711c78",
    "49644a67-db55-4701-aab1-6679259b654c",
    "b14d709c-080e-4fd9-ac99-df9612294fc7",
    "84e4736b-35fc-4d5b-9c49-31b0ae12f858",
    "a935ccdb-99ce-486e-b5bc-4f083e526e33"
  ]
}