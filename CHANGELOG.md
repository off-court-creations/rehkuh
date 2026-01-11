# Changelog

All notable changes to the rehkuh project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.9.0] - 2026-01-10

### Added

- **TubeGeometry full configuration**: All TubeGeometry parameters are now exposed with `tube` prefix for consistency
  - `tubeRadius`: Radius of the tube cross-section (default: 0.1)
  - `tubeTubularSegments`: Number of segments along the tube length (default: 64)
  - `tubeRadialSegments`: Number of segments around the tube circumference (default: 8)
  - `tubeClosed`: Whether the tube forms a closed loop (default: false)
  - Supported in JSON scene format, TSP format, viewport rendering, and import/export

### Changed

- TSP format version changed from `1.0` to `0.9.0` to reflect pre-1.0 development status
