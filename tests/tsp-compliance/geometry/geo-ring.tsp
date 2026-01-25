{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "064333c7-521d-4821-9157-9546e7fde868",
    "created": "2026-01-25T19:37:51.916Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "geo-ring",
    "description": "Ring geometry test: arc segment, thin halo"
  },
  "materials": {
    "mat_4a90d9_30_50": {
      "color": "#4a90d9",
      "metalness": 0.3,
      "roughness": 0.5,
      "side": "double"
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
      "roughness": 0.5,
      "side": "double"
    }
  },
  "geometries": {
    "ring": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ]
    },
    "ring_7224a495": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaLength": 4.7124
    },
    "ring_3b42eb19": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringInnerRadius": 0.45,
      "ringOuterRadius": 0.5
    },
    "ring_4e2124fe": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringInnerRadius": 0.1,
      "ringOuterRadius": 0.5,
      "ringPhiSegments": 4
    },
    "ring_d560e780": {
      "type": "ring",
      "args": [
        0.25,
        0.5,
        32
      ],
      "ringThetaLength": 3.14159
    }
  },
  "objects": [
    {
      "id": "c0554803-9416-469a-b625-b699746ffdcc",
      "name": "ring_default",
      "type": "ring",
      "position": [
        -3,
        0,
        0
      ],
      "rotation": [
        -1.5708,
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
      "geometry": "ring",
      "material": "mat_4a90d9_30_50"
    },
    {
      "id": "7224a495-9516-485c-9a3d-caf1437ac344",
      "name": "ring_arc",
      "type": "ring",
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        -1.5708,
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
      "geometry": "ring_7224a495",
      "material": "mat_d94a4a_30_50"
    },
    {
      "id": "3b42eb19-e54f-4975-b319-8365fb8ea41e",
      "name": "ring_thin_halo",
      "type": "ring",
      "position": [
        3,
        0,
        0
      ],
      "rotation": [
        -1.5708,
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
      "geometry": "ring_3b42eb19",
      "material": "mat_4ad94a_30_50"
    },
    {
      "id": "4e2124fe-48ba-4b23-ad39-56cc1dba1209",
      "name": "ring_thick",
      "type": "ring",
      "position": [
        -1.5,
        2,
        0
      ],
      "rotation": [
        -1.5708,
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
      "geometry": "ring_4e2124fe",
      "material": "mat_d9d94a_30_50"
    },
    {
      "id": "d560e780-3d16-4b55-8646-f800a78c1ac8",
      "name": "ring_half",
      "type": "ring",
      "position": [
        1.5,
        2,
        0
      ],
      "rotation": [
        -1.5708,
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
      "geometry": "ring_d560e780",
      "material": "mat_9b5de5_30_50"
    }
  ],
  "roots": [
    "c0554803-9416-469a-b625-b699746ffdcc",
    "7224a495-9516-485c-9a3d-caf1437ac344",
    "3b42eb19-e54f-4975-b319-8365fb8ea41e",
    "4e2124fe-48ba-4b23-ad39-56cc1dba1209",
    "d560e780-3d16-4b55-8646-f800a78c1ac8"
  ]
}