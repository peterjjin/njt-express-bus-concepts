# NJT Express Bus Concepts

Planning maps for three potential express bus concepts to Secaucus Junction, with Neilson Plaza and Mary Ellis Burial Site park-and-ride alternatives. Neilson Plaza is selected by default.

P&R callouts group screened NJ TRANSIT, university/local, and commuter/longer-distance buses. Weekday, Saturday, and Sunday figures are May 2024 average daily **route-wide** ridership, not site boardings or a demand forecast. Missing ridership is shown as N/A, not zero. Nearby stops requiring a local shuttle are identified explicitly. The stop screening uses September 2026 sources and excludes highway routes without a stop within the screening range.

This is a planning-study website, not an official NJ TRANSIT service announcement. Alignments, boarding sites, access assumptions, operating permissions, and return-direction routing require review. In particular, the Molly Pitcher concept assumes an unapproved local access opening and northbound entry at Exit 8.

## Contents

- `site/Interactive website/`: interactive map, sibling alternatives, route geometry, and provenance.
- `site/Route maps snapshots/`: six 300-dpi images, preview gallery, and download package.
- `site/index.html`: opens the main map and preserves alternative query parameters.

Only the publishing files are included. No source archive, raw GTFS downloads, local server programs, private credentials, or unrelated workshop files are published.

## Render static-site configuration

- Build command: `python3 validate_site.py`
- Publish directory: `site`
- Referrer-Policy header: `strict-origin-when-cross-origin`
- Service type: Static Site, not a Python web service

`render.yaml` contains the corresponding Blueprint configuration. No paid compute or database is needed for this static site; Render account bandwidth and build limits still apply.

## Maps and attribution

The interactive background uses OpenStreetMap standard tiles without an API token, preserving browser caching and the real HTTP referrer. Follow the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/). Do not use automated tile-download or prefetch jobs. Existing image exports are retained; new automated exports require a provider and terms that permit that use.

Basemap data: © OpenStreetMap contributors. Route-source links and planning assumptions are included in each alternative. No proprietary tile-provider key is included.
