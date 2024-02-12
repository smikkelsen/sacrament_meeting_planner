class ProgramItem < ApplicationRecord
  enum item_type: { speaker: 1, intermediate_hymn: 4, musical_number: 2, program_other: 3, announcement: 20,
                    release: 21, sustaining: 22, business: 23 }

  belongs_to :program

  validates_presence_of :item_type, :key
  self.per_page = 10
end
