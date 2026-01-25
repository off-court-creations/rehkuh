{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "f9f89a3a-d76f-4ff3-ab1b-00dee1512f56",
    "created": "2026-01-25T19:49:47.018Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "mat-standard-basic",
    "description": "Standard material test: color, metalness, roughness only"
  },
  "materials": {
    "mat_4a90d9_10_10": {
      "color": "#4a90d9",
      "metalness": 0.1,
      "roughness": 0.1
    },
    "mat_4a90d9_10_90": {
      "color": "#4a90d9",
      "metalness": 0.1,
      "roughness": 0.9
    },
    "mat_4a90d9_90_10": {
      "color": "#4a90d9",
      "metalness": 0.9,
      "roughness": 0.1
    },
    "mat_4a90d9_90_90": {
      "color": "#4a90d9",
      "metalness": 0.9,
      "roughness": 0.9
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
    "mat_ffd700_90_30": {
      "color": "#ffd700",
      "metalness": 0.9,
      "roughness": 0.3
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
      "id": "25c4d4e6-6ee8-486b-999e-67d793ed904c",
      "name": "mat_low_metal_low_rough",
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
      "material": "mat_4a90d9_10_10"
    },
    {
      "id": "6eb0b7eb-5814-4485-bdef-7c9b88a11184",
      "name": "mat_low_metal_high_rough",
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
      "geometry": "sphere",
      "material": "mat_4a90d9_10_90"
    },
    {
      "id": "91f7a854-3462-4603-baa4-bff1a194393e",
      "name": "mat_high_metal_low_rough",
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
      "geometry": "sphere",
      "material": "mat_4a90d9_90_10"
    },
    {
      "id": "798cf1f2-5267-4c06-8976-874aac941c02",
      "name": "mat_high_metal_high_rough",
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
      "geometry": "sphere",
      "material": "mat_4a90d9_90_90"
    },
    {
      "id": "2910c0d0-33f7-449c-a2d0-5c90dd238a4c",
      "name": "mat_red",
      "type": "sphere",
      "position": [
        -2,
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
      "geometry": "sphere",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "42c3191c-0cf1-4e8b-ab49-a5075a156004",
      "name": "mat_green",
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
      "geometry": "sphere",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "b102f47a-596b-43cb-b980-efb7fd17e7fe",
      "name": "mat_gold",
      "type": "sphere",
      "position": [
        2,
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
      "geometry": "sphere",
      "material": "mat_ffd700_90_30"
    }
  ],
  "roots": [
    "25c4d4e6-6ee8-486b-999e-67d793ed904c",
    "6eb0b7eb-5814-4485-bdef-7c9b88a11184",
    "91f7a854-3462-4603-baa4-bff1a194393e",
    "798cf1f2-5267-4c06-8976-874aac941c02",
    "2910c0d0-33f7-449c-a2d0-5c90dd238a4c",
    "42c3191c-0cf1-4e8b-ab49-a5075a156004",
    "b102f47a-596b-43cb-b980-efb7fd17e7fe"
  ]
}