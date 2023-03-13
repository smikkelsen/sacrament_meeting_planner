class Template < ApplicationRecord
  enum template_type: { conducting: 1, program: 2 }

  validates_presence_of :template_type, :name

end
