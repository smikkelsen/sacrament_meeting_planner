class Hymn < ApplicationRecord
  validates :name, presence: true, uniqueness: { scope: :page, case_sensitive: false }
  validates :page, presence: true, uniqueness: {scope: :category}
end
