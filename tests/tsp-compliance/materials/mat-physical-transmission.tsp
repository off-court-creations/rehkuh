{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "a46779e8-d95b-43ed-bbe5-8847b7ca02d8",
    "created": "2026-01-25T20:24:26.036Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Transmission Test",
    "description": "Tests transmission, thickness, and ior for glass effects"
  },
  "materials": {
    "mat_physical_b01db59d": {
      "type": "physical",
      "color": "#FF4444",
      "metalness": 0,
      "roughness": 0.5
    },
    "mat_physical_b9fa8249": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5
    },
    "mat_physical_f94acc1c": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.33
    },
    "mat_physical_f9493fff": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 2.33
    },
    "mat_physical_b9b6824d": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.1,
      "ior": 1.5
    },
    "mat_physical_26d8648": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1.5,
      "ior": 1.5
    },
    "mat_physical_8116ab94": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0.3,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5
    },
    "mat_physical_89f33413": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 0.5,
      "thickness": 0.5,
      "ior": 1.5
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
      "id": "6ede4b77-925b-4ca1-9e15-687609542750",
      "name": "reference_solid",
      "type": "box",
      "position": [
        0,
        0.25,
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
      "geometry": "box",
      "material": "mat_physical_b01db59d"
    },
    {
      "id": "315e6cd8-f24f-4d5e-b766-02f62feb581b",
      "name": "glass_basic",
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
      "material": "mat_physical_b9fa8249"
    },
    {
      "id": "26148883-5193-4371-b4b6-371322b99000",
      "name": "glass_water_ior",
      "type": "sphere",
      "position": [
        1.56,
        0.5,
        1.95
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
      "material": "mat_physical_f94acc1c"
    },
    {
      "id": "f1e25867-e329-4ab7-b959-88fbae750bd5",
      "name": "glass_diamond_ior",
      "type": "sphere",
      "position": [
        -0.56,
        0.5,
        2.44
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
      "material": "mat_physical_f9493fff"
    },
    {
      "id": "47d44d09-c1fe-4106-8743-d9978edbac88",
      "name": "glass_thin",
      "type": "box",
      "position": [
        -2.25,
        0.5,
        1.08
      ],
      "rotation": [
        0,
        0.3,
        0
      ],
      "scale": [
        1,
        1,
        0.1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_physical_b9b6824d"
    },
    {
      "id": "73a810ea-d1c7-430a-a309-b1bc02850dd8",
      "name": "glass_thick",
      "type": "box",
      "position": [
        -2.25,
        0.75,
        -1.08
      ],
      "rotation": [
        0,
        0.3,
        0
      ],
      "scale": [
        1,
        1.5,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_physical_26d8648"
    },
    {
      "id": "d4b21cf4-3459-4697-8d62-9cb4e0eaf535",
      "name": "glass_frosted",
      "type": "sphere",
      "position": [
        -0.56,
        0.5,
        -2.44
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
      "material": "mat_physical_8116ab94"
    },
    {
      "id": "71b826db-5e88-4800-afce-568a908ba986",
      "name": "glass_partial",
      "type": "torus",
      "position": [
        1.56,
        0.5,
        -1.95
      ],
      "rotation": [
        0.5,
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
      "material": "mat_physical_89f33413"
    }
  ],
  "roots": [
    "6ede4b77-925b-4ca1-9e15-687609542750",
    "315e6cd8-f24f-4d5e-b766-02f62feb581b",
    "26148883-5193-4371-b4b6-371322b99000",
    "f1e25867-e329-4ab7-b959-88fbae750bd5",
    "47d44d09-c1fe-4106-8743-d9978edbac88",
    "73a810ea-d1c7-430a-a309-b1bc02850dd8",
    "d4b21cf4-3459-4697-8d62-9cb4e0eaf535",
    "71b826db-5e88-4800-afce-568a908ba986"
  ]
}