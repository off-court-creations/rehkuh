{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "11881b8f-9e90-4e74-b5af-feb60a40657d",
    "created": "2026-01-25T20:25:11.351Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Attenuation Test",
    "description": "Tests attenuationColor and attenuationDistance for colored glass effects"
  },
  "materials": {
    "mat_physical_9c01b91d": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0.5
    },
    "mat_physical_a2f67460": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "attenuationColor": "#FF8C00",
      "attenuationDistance": 0.5,
      "ior": 1.5
    },
    "mat_physical_8e318e27": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "attenuationColor": "#8B0000",
      "attenuationDistance": 0.3,
      "ior": 1.5
    },
    "mat_physical_f8e4e24b": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "attenuationColor": "#00FF7F",
      "attenuationDistance": 0.4,
      "ior": 1.5
    },
    "mat_physical_daf9ea1a": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "attenuationColor": "#0044FF",
      "attenuationDistance": 0.4,
      "ior": 1.5
    },
    "mat_physical_7a67f00": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "attenuationColor": "#9400D3",
      "attenuationDistance": 0.4,
      "ior": 1.5
    },
    "mat_physical_7e4a7105": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1.5,
      "attenuationColor": "#FF4500",
      "attenuationDistance": 0.1,
      "ior": 1.5
    },
    "mat_physical_489f83d8": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1.5,
      "attenuationColor": "#FF4500",
      "attenuationDistance": 2,
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
    }
  },
  "objects": [
    {
      "id": "bb070ea2-fe20-446e-9de8-b2af36ec6cb6",
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
      "material": "mat_physical_9c01b91d"
    },
    {
      "id": "141886e3-0995-4efe-83fe-dafd2025594c",
      "name": "amber_glass",
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
      "material": "mat_physical_a2f67460"
    },
    {
      "id": "d679571c-24cc-4ddb-ac82-f5f890528299",
      "name": "wine_glass",
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
      "material": "mat_physical_8e318e27"
    },
    {
      "id": "b712fb5c-1788-41b9-b487-90156f93078f",
      "name": "emerald_glass",
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
      "material": "mat_physical_f8e4e24b"
    },
    {
      "id": "5a68cfac-96e3-4eae-b71a-d543907f0b81",
      "name": "sapphire_glass",
      "type": "sphere",
      "position": [
        -2.25,
        0.5,
        1.08
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
      "material": "mat_physical_daf9ea1a"
    },
    {
      "id": "54643ba0-70ff-492d-8164-66c3bb4ce334",
      "name": "amethyst_glass",
      "type": "sphere",
      "position": [
        -2.25,
        0.5,
        -1.08
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
      "material": "mat_physical_7a67f00"
    },
    {
      "id": "a50cee1b-794e-4405-90f5-c1988638df24",
      "name": "short_distance",
      "type": "box",
      "position": [
        -0.56,
        0.75,
        -2.44
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
      "material": "mat_physical_7e4a7105"
    },
    {
      "id": "45361e18-54e8-4fde-81eb-42c87088dbda",
      "name": "long_distance",
      "type": "box",
      "position": [
        1.56,
        0.75,
        -1.95
      ],
      "rotation": [
        0,
        -0.3,
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
      "material": "mat_physical_489f83d8"
    }
  ],
  "roots": [
    "bb070ea2-fe20-446e-9de8-b2af36ec6cb6",
    "141886e3-0995-4efe-83fe-dafd2025594c",
    "d679571c-24cc-4ddb-ac82-f5f890528299",
    "b712fb5c-1788-41b9-b487-90156f93078f",
    "5a68cfac-96e3-4eae-b71a-d543907f0b81",
    "54643ba0-70ff-492d-8164-66c3bb4ce334",
    "a50cee1b-794e-4405-90f5-c1988638df24",
    "45361e18-54e8-4fde-81eb-42c87088dbda"
  ]
}