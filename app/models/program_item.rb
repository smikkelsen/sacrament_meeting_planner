class ProgramItem < ApplicationRecord
  enum item_type: { speaker: 1, musical_number: 2, program_other: 3, announcement: 20, release: 21, sustaining: 22 }

  belongs_to :program

  validates_presence_of :value
  # validates_presence_of :key, if: -> {item_type.in? [:program_other]}
end
