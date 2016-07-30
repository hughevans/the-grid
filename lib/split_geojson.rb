require 'json'
require 'fileutils'

geojson = JSON.parse(File.open('data/sa3_2011_aust_polygon.geojson').read)

grouped_features = {}

geojson['features'].each do |feature|
  sa3_code = feature['properties']['sa3_code_2']
  grouped_features[sa3_code] ||= []
  grouped_features[sa3_code] << feature
end

grouped_features.each do |code, features|
  geojson = {
    type: 'FeatureCollection',
    features: features
  }

  filename = "geotiles/geojson/#{code}.geojson"
  File.open(filename, 'w') { |file| file.write(JSON.pretty_generate(geojson)) }
end
