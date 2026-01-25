{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "093bad2e-5484-452a-85b1-40ba945ce15b",
    "created": "2026-01-25T20:26:32.271Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Physical Material - Iridescence Test",
    "description": "Tests iridescence, iridescenceIOR, and iridescenceThicknessRange for soap bubble/oil slick effects"
  },
  "materials": {
    "mat_physical_e40a49fe": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 0.3,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [
        100,
        400
      ]
    },
    "mat_physical_29d7ffb": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 0.6,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [
        100,
        400
      ]
    },
    "mat_physical_51d5b922": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 1,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [
        100,
        400
      ]
    },
    "mat_physical_87df78f6": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 1,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [
        50,
        150
      ]
    },
    "mat_physical_b7e172ac": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 1,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [
        300,
        800
      ]
    },
    "mat_physical_2629f37c": {
      "type": "physical",
      "color": "#1a1a1a",
      "metalness": 0,
      "roughness": 0.1,
      "iridescence": 1,
      "iridescenceIOR": 2,
      "iridescenceThicknessRange": [
        100,
        400
      ]
    },
    "mat_physical_2eb006c7": {
      "type": "physical",
      "color": "#FFFFFF",
      "metalness": 0,
      "roughness": 0,
      "transmission": 0.9,
      "thickness": 0.01,
      "ior": 1.33,
      "iridescence": 1,
      "iridescenceIOR": 1.33,
      "iridescenceThicknessRange": [
        100,
        500
      ]
    },
    "mat_physical_cf3f3029": {
      "type": "physical",
      "color": "#111111",
      "metalness": 0.2,
      "roughness": 0.1,
      "iridescence": 1,
      "iridescenceIOR": 1.5,
      "iridescenceThicknessRange": [
        200,
        600
      ]
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
    "plane": {
      "type": "plane",
      "args": [
        1,
        1
      ]
    }
  },
  "objects": [
    {
      "id": "ed76d12a-cef6-4895-8c2b-dce38c65bce3",
      "name": "iridescence_low",
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
      "material": "mat_physical_e40a49fe"
    },
    {
      "id": "7e79e4df-3ac6-405c-bc9b-fc54f71eff61",
      "name": "iridescence_medium",
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
      "material": "mat_physical_29d7ffb"
    },
    {
      "id": "7a47d052-9a69-41c3-9335-b186bbf2867b",
      "name": "iridescence_high",
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
      "material": "mat_physical_51d5b922"
    },
    {
      "id": "66069b65-7b8e-440c-a048-f8a4e3180d5e",
      "name": "thin_film",
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
      "material": "mat_physical_87df78f6"
    },
    {
      "id": "2423a689-325e-4837-af74-f0830c0b6116",
      "name": "thick_film",
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
      "material": "mat_physical_b7e172ac"
    },
    {
      "id": "700ff92d-0c28-42bb-89d3-d1a13469174e",
      "name": "high_ior",
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
      "material": "mat_physical_2629f37c"
    },
    {
      "id": "411fa503-37e2-442a-ba65-21729292a733",
      "name": "soap_bubble",
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
      "material": "mat_physical_2eb006c7"
    },
    {
      "id": "2809de62-3120-4b63-93e6-adcb00355349",
      "name": "oil_slick",
      "type": "plane",
      "position": [
        1.5,
        0.01,
        -3
      ],
      "rotation": [
        -1.571,
        0,
        0
      ],
      "scale": [
        2,
        2,
        1
      ],
      "parent": null,
      "visible": true,
      "geometry": "plane",
      "material": "mat_physical_cf3f3029"
    }
  ],
  "roots": [
    "ed76d12a-cef6-4895-8c2b-dce38c65bce3",
    "7e79e4df-3ac6-405c-bc9b-fc54f71eff61",
    "7a47d052-9a69-41c3-9335-b186bbf2867b",
    "66069b65-7b8e-440c-a048-f8a4e3180d5e",
    "2423a689-325e-4837-af74-f0830c0b6116",
    "700ff92d-0c28-42bb-89d3-d1a13469174e",
    "411fa503-37e2-442a-ba65-21729292a733",
    "2809de62-3120-4b63-93e6-adcb00355349"
  ]
}