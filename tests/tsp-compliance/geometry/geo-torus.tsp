{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "14c04bbb-31fd-4d08-817e-6786275d9e8c",
    "created": "2026-01-25T19:34:53.020Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-torus",
    "description": "Torus geometry test: C-shape (arc < 2π), thick blob, square tube"
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
      "roughness": 0.5,
      "side": "double"
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
      "roughness": 0.5,
      "side": "double"
    }
  },
  "geometries": {
    "torus": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ]
    },
    "torus_acc9c992": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusArc": 4.7124
    },
    "torus_cf5df893": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadius": 0.3,
      "torusTube": 0.25
    },
    "torus_d16d6274": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadialSegments": 4,
      "torusTubularSegments": 32
    },
    "torus_a55ce9c6": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusRadius": 0.5,
      "torusTube": 0.05
    },
    "torus_befa48f6": {
      "type": "torus",
      "args": [
        0.5,
        0.2,
        16,
        32
      ],
      "torusArc": 3.14159
    }
  },
  "objects": [
    {
      "id": "02bab70a-c00f-4da8-80a4-31a7e5f21529",
      "name": "torus_default",
      "type": "torus",
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
      "geometry": "torus",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "acc9c992-7de3-4331-ba3e-3bcd1474bcc7",
      "name": "torus_cshape",
      "type": "torus",
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
      "geometry": "torus_acc9c992",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "cf5df893-332d-40a8-a127-7ad95448b2d7",
      "name": "torus_thick",
      "type": "torus",
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
      "geometry": "torus_cf5df893",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "d16d6274-9b53-4aa2-a519-576f006800e3",
      "name": "torus_square_tube",
      "type": "torus",
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
      "geometry": "torus_d16d6274",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "a55ce9c6-3401-443a-8e05-7cecfb1f36b3",
      "name": "torus_thin",
      "type": "torus",
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
      "geometry": "torus_a55ce9c6",
      "material": "mat_9b5de5_30_50"
    },
    {
      "id": "befa48f6-235f-4982-9e28-cc623b0ee7b0",
      "name": "torus_half",
      "type": "torus",
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
      "geometry": "torus_befa48f6",
      "material": "mat_ff6b35_30_50"
    }
  ],
  "roots": [
    "02bab70a-c00f-4da8-80a4-31a7e5f21529",
    "acc9c992-7de3-4331-ba3e-3bcd1474bcc7",
    "cf5df893-332d-40a8-a127-7ad95448b2d7",
    "d16d6274-9b53-4aa2-a519-576f006800e3",
    "a55ce9c6-3401-443a-8e05-7cecfb1f36b3",
    "befa48f6-235f-4982-9e28-cc623b0ee7b0"
  ]
}