{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "77431fc1-4a9f-4af8-9197-a989b82ff399",
    "created": "2026-01-25T19:40:04.785Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-platonic",
    "description": "Platonic solids test: tetrahedron, octahedron, dodecahedron, icosahedron (with detail levels)"
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
    "mat_9b5de5_30_50": {
      "color": "#9b5de5",
      "metalness": 0.3,
      "roughness": 0.5
    }
  },
  "geometries": {
    "tetrahedron": {
      "type": "tetrahedron",
      "args": [
        0.5,
        0
      ]
    },
    "tetrahedron_4d69fab7": {
      "type": "tetrahedron",
      "args": [
        0.5,
        0
      ],
      "tetraDetail": 1
    },
    "octahedron": {
      "type": "octahedron",
      "args": [
        0.5,
        0
      ]
    },
    "octahedron_ddf2f050": {
      "type": "octahedron",
      "args": [
        0.5,
        0
      ],
      "octaDetail": 1
    },
    "dodecahedron": {
      "type": "dodecahedron",
      "args": [
        0.5,
        0
      ]
    },
    "dodecahedron_f70e1036": {
      "type": "dodecahedron",
      "args": [
        0.5,
        0
      ],
      "dodecaDetail": 1
    },
    "icosahedron": {
      "type": "icosahedron",
      "args": [
        0.5,
        0
      ]
    },
    "icosahedron_0b77d189": {
      "type": "icosahedron",
      "args": [
        0.5,
        0
      ],
      "icosaDetail": 1
    }
  },
  "objects": [
    {
      "id": "21e43c70-c81c-4ce3-a463-b7d97ec55cab",
      "name": "tetrahedron_default",
      "type": "tetrahedron",
      "position": [
        -4.5,
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
      "geometry": "tetrahedron",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "4d69fab7-184f-4595-984a-2dea40c6b81f",
      "name": "tetrahedron_detail",
      "type": "tetrahedron",
      "position": [
        -4.5,
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
      "geometry": "tetrahedron_4d69fab7",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "1689a065-4af2-459c-aeb2-2b9d38758cda",
      "name": "octahedron_default",
      "type": "octahedron",
      "position": [
        -1.5,
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
      "geometry": "octahedron",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "ddf2f050-24dd-437e-a3d2-be3380647d52",
      "name": "octahedron_detail",
      "type": "octahedron",
      "position": [
        -1.5,
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
      "geometry": "octahedron_ddf2f050",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "d344e1a7-b536-4eec-ba0d-0c4bfd0deb90",
      "name": "dodecahedron_default",
      "type": "dodecahedron",
      "position": [
        1.5,
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
      "geometry": "dodecahedron",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "f70e1036-c687-40e0-85d1-9f10fa8b7311",
      "name": "dodecahedron_detail",
      "type": "dodecahedron",
      "position": [
        1.5,
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
      "geometry": "dodecahedron_f70e1036",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "911afa2a-87ea-4017-85a0-f458d3bd7e13",
      "name": "icosahedron_default",
      "type": "icosahedron",
      "position": [
        4.5,
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
      "geometry": "icosahedron",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "0b77d189-e1d9-437b-a4d8-9ac6eb26f63b",
      "name": "icosahedron_detail",
      "type": "icosahedron",
      "position": [
        4.5,
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
      "geometry": "icosahedron_0b77d189",
      "material": "mat_9b5de5_30_50"
    }
  ],
  "roots": [
    "21e43c70-c81c-4ce3-a463-b7d97ec55cab",
    "4d69fab7-184f-4595-984a-2dea40c6b81f",
    "1689a065-4af2-459c-aeb2-2b9d38758cda",
    "ddf2f050-24dd-437e-a3d2-be3380647d52",
    "d344e1a7-b536-4eec-ba0d-0c4bfd0deb90",
    "f70e1036-c687-40e0-85d1-9f10fa8b7311",
    "911afa2a-87ea-4017-85a0-f458d3bd7e13",
    "0b77d189-e1d9-437b-a4d8-9ac6eb26f63b"
  ]
}