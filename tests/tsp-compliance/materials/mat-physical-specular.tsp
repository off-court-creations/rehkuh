{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "7ba2a0fe-d1c1-4a1c-968c-eb15fe618868",
    "created": "2026-01-25T20:32:47.949Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Specular Test",
    "description": "Tests specularIntensity, specularColor, and reflectivity"
  },
  "materials": {
    "mat_physical_4b5e9d14": {
      "type": "physical",
      "color": "#4444FF",
      "metalness": 0,
      "roughness": 0.3,
      "specularIntensity": 0
    },
    "mat_physical_9d7a36cf": {
      "type": "physical",
      "color": "#4444FF",
      "metalness": 0,
      "roughness": 0.3,
      "specularIntensity": 0.5
    },
    "mat_physical_4b5e9d15": {
      "type": "physical",
      "color": "#4444FF",
      "metalness": 0,
      "roughness": 0.3,
      "specularIntensity": 1
    },
    "mat_physical_7fd90968": {
      "type": "physical",
      "color": "#333333",
      "metalness": 0,
      "roughness": 0.2,
      "specularIntensity": 1,
      "specularColor": "#FF4444"
    },
    "mat_physical_bd7f5968": {
      "type": "physical",
      "color": "#333333",
      "metalness": 0,
      "roughness": 0.2,
      "specularIntensity": 1,
      "specularColor": "#44FF44"
    },
    "mat_physical_7fbe371b": {
      "type": "physical",
      "color": "#333333",
      "metalness": 0,
      "roughness": 0.2,
      "specularIntensity": 1,
      "specularColor": "#FFD700"
    },
    "mat_physical_26d3b98a": {
      "type": "physical",
      "color": "#888888",
      "metalness": 0,
      "roughness": 0.1,
      "reflectivity": 0.2
    },
    "mat_physical_169a67d7": {
      "type": "physical",
      "color": "#888888",
      "metalness": 0,
      "roughness": 0.1,
      "reflectivity": 1
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
    }
  },
  "objects": [
    {
      "id": "e2c6e099-1521-48af-9bea-f1b538862fc1",
      "name": "specular_none",
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
      "material": "mat_physical_4b5e9d14"
    },
    {
      "id": "0d15044e-1ceb-4ad9-aad6-20c8adf868c4",
      "name": "specular_medium",
      "type": "sphere",
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
      "geometry": "sphere",
      "material": "mat_physical_9d7a36cf"
    },
    {
      "id": "a8cb8d80-2412-49b5-adbc-96b8ee5cb954",
      "name": "specular_full",
      "type": "sphere",
      "position": [
        3,
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
      "material": "mat_physical_4b5e9d15"
    },
    {
      "id": "0b26fbc9-599f-49de-95f1-99fe8df589ec",
      "name": "specular_red_tint",
      "type": "sphere",
      "position": [
        -3,
        0.5,
        3
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
      "material": "mat_physical_7fd90968"
    },
    {
      "id": "db4f6225-eb8a-425b-b49c-ffc772198644",
      "name": "specular_green_tint",
      "type": "sphere",
      "position": [
        0,
        0.5,
        3
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
      "material": "mat_physical_bd7f5968"
    },
    {
      "id": "d7f140a6-b997-42e7-aa7a-22195bc6d496",
      "name": "specular_gold_tint",
      "type": "sphere",
      "position": [
        3,
        0.5,
        3
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
      "material": "mat_physical_7fbe371b"
    },
    {
      "id": "0e6a0500-f174-4b75-b736-69f9cb0c3a51",
      "name": "reflectivity_low",
      "type": "sphere",
      "position": [
        -1.5,
        0.5,
        -3
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
      "material": "mat_physical_26d3b98a"
    },
    {
      "id": "c706d94f-d2ed-4fe9-9e7a-710afefb3fca",
      "name": "reflectivity_high",
      "type": "sphere",
      "position": [
        1.5,
        0.5,
        -3
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
      "material": "mat_physical_169a67d7"
    }
  ],
  "roots": [
    "e2c6e099-1521-48af-9bea-f1b538862fc1",
    "0d15044e-1ceb-4ad9-aad6-20c8adf868c4",
    "a8cb8d80-2412-49b5-adbc-96b8ee5cb954",
    "0b26fbc9-599f-49de-95f1-99fe8df589ec",
    "db4f6225-eb8a-425b-b49c-ffc772198644",
    "d7f140a6-b997-42e7-aa7a-22195bc6d496",
    "0e6a0500-f174-4b75-b736-69f9cb0c3a51",
    "c706d94f-d2ed-4fe9-9e7a-710afefb3fca"
  ]
}