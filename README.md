# The Grid

My GovHack 2016 project using the [SA3 Region Innovation Data 2009-15](https://data.gov.au/dataset/sa3-region-innovation-data).

## Setup

### For the Ruby scripts

This requires Ruby 2.3.1 installed.

```
gem install bundler
git clone git@github.com:hughevans/the-grid.git
cd the-grid
cp .env{.example,}
bundle install
```

### For the node scripts

This requires the latest Node and NPM.

```
cd geotiles
npm install
```

```
cd app
npm install
```

## Generating the JSON for the areas

```
ruby lib/process_data.rb
```

## Splitting up the GeoJSON

```
ruby lib/split_geojson.rb
```

## Creating the tile matrix for each area

```
cd geotiles
node index.js
```
