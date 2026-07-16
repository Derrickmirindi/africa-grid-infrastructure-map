# AfriGrid Atlas — Africa Grid Infrastructure Map

# Developed by Derrick Mirindi, Frederic Mirindi & David Sinkhonde

<img width="1908" height="982" alt="image" src="https://github.com/user-attachments/assets/008e1a31-452c-4a84-826e-f2f33fb5bb53" />

AfriGrid Atlas is an interactive atlas that maps Africa's electricity grid in one place: power plants, transmission lines, substations, data centers, and locational electricity prices. It is an African adaptation of the US Grid Infrastructure Map (InfraMap, inframap.org), rebuilt with the same feature set for the African context.

## Motivation

Africa's electricity challenge is not only to produce more power, it is to ensure that power reaches households. National generation capacity does not automatically translate into equitable access (the "Resource Access Paradox"). This atlas makes the grid explorable so students, researchers, and citizens can see where generation, transmission, and access diverge.

## Features (mirrors InfraMap)

- Interactive map of Africa showing:
  - Power plants (with fuel type, capacity in MW)
  - Transmission lines
  - Substations
  - Data centers
  - Locational electricity prices
- Layer toggles and filters for each infrastructure type
- Color-coded price/legend scale
- Zoom, pan, and clickable points with detail popups
- Live/updated data panel and search

## Data Sources (African equivalents of FERC/EIA)

- World Bank Development Indicators (electricity access, output, GDP)
- IEA / IRENA Africa energy datasets
- OpenStreetMap power infrastructure (lines, substations, plants)
- Global Energy Monitor (Global Power Plant Tracker)
- African Union / regional power pool (WAPP, EAPP, SAPP, CAPP) data
- Nighttime lights + population rasters for access estimation

## Pipeline

- Data scraping and ingestion from public portals
- Algorithmic geolocation matching of plants/substations to coordinates
- Normalization into GeoJSON layers
- Frontend deployed on Vercel / Cloudflare Pages

## Tech Stack

- Frontend: Next.js / React + Mapbox GL (or MapLibre)
- Data processing: Python (pandas, geopandas)
- Hosting: Vercel / Cloudflare Pages

## Extensions Beyond InfraMap

- Urban vs. rural electricity access layer and the urban-rural access gap
- ARIMA-based access forecasts toward the SDG7 2030 target
- Country archetype clustering (Near-Universal, Intermediate, Maximum Gap, Deeply Excluded)

## Roadmap

- [ ] Assemble country-level infrastructure datasets
- [ ] Build geolocation matching pipeline
- [ ] Generate GeoJSON layers
- [ ] Implement interactive map UI with layer toggles
- [ ] Add locational price and access layers
- [ ] Deploy public site

## We are opened for collaboration.
