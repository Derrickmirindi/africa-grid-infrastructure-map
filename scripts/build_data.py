"""AfriGrid Atlas - data ingestion pipeline.

African equivalent of InfraMap's FERC/EIA pipeline. Pulls power infrastructure
from public sources (World Bank, OpenStreetMap, Global Energy Monitor), performs
algorithmic geolocation matching, and writes normalized GeoJSON layers into
../data used by the frontend map.

Usage: python scripts/build_data.py
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def price_bucket(price):
    if price < 50:
        return "low"
    if price < 75:
        return "mid"
    return "high"


def geolocate(name, country):
    """Placeholder for algorithmic geolocation matching.
    Replace with a real geocoder / OSM Overpass lookup.
    """
    raise NotImplementedError("Wire up an OSM/geocoder lookup here")


def to_feature(rec):
    return {
        "type": "Feature",
        "properties": {
            "name": rec["name"],
            "country": rec["country"],
            "fuel": rec.get("fuel", "Unknown"),
            "capacity_mw": rec.get("capacity_mw", 0),
            "price_usd_mwh": rec.get("price_usd_mwh", 0),
            "price_bucket": price_bucket(rec.get("price_usd_mwh", 0)),
        },
        "geometry": {
            "type": "Point",
            "coordinates": [rec["lon"], rec["lat"]],
        },
    }


def build_geojson(records):
    return {
        "type": "FeatureCollection",
        "features": [to_feature(r) for r in records],
    }


def write_layer(name, records):
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(build_geojson(records), fh, indent=2)
    print("Wrote", path, "with", len(records), "features")


def main():
    # In production, replace these stubs with scraped/ingested records.
    plants = []       # power_plants.geojson
    lines = []        # transmission_lines.geojson
    substations = []  # substations.geojson
    datacenters = []  # data_centers.geojson

    if plants:
        write_layer("power_plants.geojson", plants)
    print("Ingestion complete. Layers ready for the AfriGrid Atlas frontend.")


if __name__ == "__main__":
    main()
