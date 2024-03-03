class BulletinItem < ApplicationRecord
  enum item_type: { ward: 1, relief_society: 2, elders_quorum: 3 }

  validates_presence_of :item_type, :message, :position

end
