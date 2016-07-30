module Scoring
  def calculate_score
    patent_score
  end

  def patent_score
    (patent_applications != 0 ? patent_applications / population * 1000 : 0) +
    (patents_relative != 0 ? patents_relative * 1000 : 0)
  end
end
