{
  "metadata": {
    "version": "1.0.0",
    "prerelease": "rc.1",
    "id": "386e9c91-8c1d-414b-ac3d-c49476fb9849",
    "created": "2026-01-25T20:52:50.732Z",
    "generator": "rehkuh",
    "generatorVersion": "1.0.0",
    "copyright": "Test 2026",
    "author": "Ben Chapman",
    "title": "Animation - Quaternion Test",
    "description": "Tests rotation via quaternion with 90, 180, and 360 degree rotations"
  },
  "materials": {
    "mat_582173c0": {
      "color": "#FF4444",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_f95203c0": {
      "color": "#44FF44",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_751e93c0": {
      "color": "#4444FF",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_992e0480": {
      "color": "#FFFF44",
      "metalness": 0.3,
      "roughness": 0.5
    },
    "mat_10b69480": {
      "color": "#FF44FF",
      "metalness": 0.3,
      "roughness": 0.5
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
    "cone": {
      "type": "cone",
      "args": [
        0.5,
        1,
        32
      ]
    }
  },
  "objects": [
    {
      "id": "4f29adcb-2ced-481e-882d-4a467a58de69",
      "name": "rotate_90",
      "type": "box",
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
        0.5,
        0.3
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_582173c0"
    },
    {
      "id": "5f5e426c-2c9f-4b90-8972-c3b1c3fb2ec2",
      "name": "rotate_180",
      "type": "box",
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
        0.5,
        0.3
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_f95203c0"
    },
    {
      "id": "0ba656f2-a91d-4f9d-9761-04aedea51c85",
      "name": "rotate_360",
      "type": "box",
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
        0.5,
        0.3
      ],
      "parent": null,
      "visible": true,
      "geometry": "box",
      "material": "mat_751e93c0"
    },
    {
      "id": "158bc959-f6fa-41fe-85bc-0b6ee18da477",
      "name": "rotate_x_axis",
      "type": "cone",
      "position": [
        -1.5,
        0.5,
        3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        1,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "cone",
      "material": "mat_992e0480"
    },
    {
      "id": "097c1045-acc0-4001-ae52-3d968564f4b4",
      "name": "rotate_z_axis",
      "type": "cone",
      "position": [
        1.5,
        0.5,
        3
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "scale": [
        0.5,
        1,
        0.5
      ],
      "parent": null,
      "visible": true,
      "geometry": "cone",
      "material": "mat_10b69480"
    }
  ],
  "roots": [
    "4f29adcb-2ced-481e-882d-4a467a58de69",
    "5f5e426c-2c9f-4b90-8972-c3b1c3fb2ec2",
    "0ba656f2-a91d-4f9d-9761-04aedea51c85",
    "158bc959-f6fa-41fe-85bc-0b6ee18da477",
    "097c1045-acc0-4001-ae52-3d968564f4b4"
  ],
  "animations": {
    "clip_quaternion_animations": {
      "name": "quaternion_animations",
      "tracks": [
        {
          "target": "4f29adcb-2ced-481e-882d-4a467a58de69",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0,
            0.3827,
            0,
            0.9239,
            0,
            0,
            0,
            1
          ]
        },
        {
          "target": "5f5e426c-2c9f-4b90-8972-c3b1c3fb2ec2",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]
        },
        {
          "target": "0ba656f2-a91d-4f9d-9761-04aedea51c85",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [
            0,
            0.5,
            1,
            1.5,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0,
            0.7071,
            0,
            0.7071,
            0,
            1,
            0,
            0,
            0,
            0.7071,
            0,
            -0.7071,
            0,
            0,
            0,
            1
          ]
        },
        {
          "target": "158bc959-f6fa-41fe-85bc-0b6ee18da477",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0.7071,
            0,
            0,
            0.7071,
            0,
            0,
            0,
            1
          ]
        },
        {
          "target": "097c1045-acc0-4001-ae52-3d968564f4b4",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [
            0,
            1,
            2
          ],
          "values": [
            0,
            0,
            0,
            1,
            0,
            0,
            0.7071,
            0.7071,
            0,
            0,
            0,
            1
          ]
        }
      ]
    }
  }
}