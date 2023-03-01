class Hymn < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :page, presence: true, uniqueness: true
end
