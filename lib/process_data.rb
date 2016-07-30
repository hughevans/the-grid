require 'rubygems'
require 'bundler/setup'

require 'csv'
require 'dotenv'
require 'rest-client'

Dotenv.load

require_relative 'scoring'

class SA3CSV
  attr_reader :raw_data

  def self.translate_headers
    {
      code: 'SA3 Code',
      name: 'SA3_Name',
      year: 'Year',
      remoteness: 'Remoteness',
      state: 'State',
      latitude: 'Latitude',
      longitude: 'Longitude',
      population: 'Estimated Resident Population',
      patent_applications: 'Patent applicants (total)',
      patents_relative: 'Patents (per 10,000 residents)',
      trademarks: 'Trademark applicants (total)',
      trademarks_relative: 'Trademark applicants (per 10,000 residents)',
      new_businesses: 'New business entries',
      new_businesses_relative: 'New business entries (per 10,000 residents)',
      r_and_d_expenditure: 'Average Business Research and Development Expenditure',
      unemployed: 'Unemployed (total)',
      labour_force: 'Labour force (total)',
      postgraduate_level: 'Postgraduate Degree Level (total, 2011)',
      graduate_diploma_level: 'Graduate Diploma and Graduate Certificate Level (total, 2011)',
      bachelor_level: 'Bachelor Degree Level (total, 2011)',
      advanced_diploma_level: 'Advanced Diploma and Diploma Level (total, 2011)',
      certificate_level: 'Certificate Level (total, 2011)',
      year_12: 'Year 12 or equivalent (total, 2011)',
      no_school: 'Did not go to school (total, 2011)',
      biz_count_accom: 'Accommodation and Food Services (count of businesses)',
      biz_count_admin: 'Administrative and Support Services (count of businesses)',
      biz_count_agriculture: 'Agriculture, Forestry and Fishing (count of businesses)',
      biz_count_arts: 'Arts and Recreation Services (count of businesses)',
      biz_count_construction: 'Construction (count of businesses)',
      biz_count_education: 'Education and Training (count of businesses)',
      biz_count_services: 'Electricity, Gas, Water and Waste Services (count of businesses)',
      biz_count_financial: 'Financial and Insurance Services (count of businesses)',
      biz_count_health: 'Health Care and Social Assistance (count of businesses)',
      biz_count_ict: 'Information Media and Telecommunications (count of businesses)',
      biz_count_manufacturing: 'Manufacturing (count of businesses)',
      biz_count_mining: 'Mining (count of businesses)',
      biz_count_professional_services: 'Professional, Scientific and Technical Services (count of businesses)',
      biz_count_public_admin: 'Public Administration and Safety (count of businesses)',
      biz_count_estate_services: 'Rental, Hiring and Real Estate Services (count of businesses)',
      biz_count_retail: 'Retail Trade (count of businesses)',
      biz_count_transport: 'Transport, Postal and Warehousing (count of businesses)',
      biz_count_wholesale: 'Wholesale Trade (count of businesses)',
      top_industry: 'Top industry (by count of businesses)',
      count_of_unis: 'Count of University Campuses (2015)',
      count_of_tafes: 'Count of TAFEs (2015)',
      count_of_research_institutes: 'Count of Research Institutes (2015)'
    }
  end

  def initialize
    @raw_data = download_data
  end

  def csv
    CSV.parse(raw_data, headers: true, converters: :all, header_converters: ->(h) { convert_header(h) })
  end

  private

  def download_data
    RestClient.get(ENV['SA3_DATASET']).body
  end

  def convert_header(header)
    SA3CSV.translate_headers.invert[header.strip]
  end
end

class SA3Data
  attr_accessor :years
  attr_reader :csv

  def initialize(csv)
    @csv = csv
    @years = {}
  end

  def process_csv
    csv.each do |row|
      create_year_hash(row)
      years[row[:year]][row[:code]] = SA3DataRow.new(row)
    end
  end

  private

  def create_year_hash(row)
    years[row[:year]] ||= {}
  end
end

class SA3DataRow
  attr_reader(*SA3CSV.translate_headers.keys)
  attr_reader :score

  include Scoring

  def initialize(csv_row)
    csv_row.each do |name, value|
      instance_variable_set("@#{name}", remove_na_values(value))
    end
    @score = calculate_score
  end

  private

  def remove_na_values(value)
    value == 'NA' ? 0 : value
  end
end

# data_set = SA3Data.new(SA3CSV.new.csv)
# data_set.process_csv
# data_set.years[2013].values.map {|r| r.score}
