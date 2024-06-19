class Hymn < ApplicationRecord
  enum category: { hymn: 1, childrens_song: 2, new_hymn: 3 }

  validates :name, presence: true, uniqueness: { scope: :page, case_sensitive: false }
  validates :page, presence: true, uniqueness: {scope: :category}
end
