# The Grid

My GovHack 2016 project using the [SA3 Region Innovation Data 2009-15](https://data.gov.au/dataset/sa3-region-innovation-data).

## Setup

This requires Ruby 2.3.1.

```
gem install bundler
git clone git@github.com:hughevans/the-grid.git
cd the-grid
cp .env{.example,}
bundle install
bundle exec pry -r ./lib/process_data.rb
```
