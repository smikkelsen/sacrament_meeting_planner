class User < ApplicationRecord
  enum role: { pending: 0, participant: 1, music: 10, clerk: 19, bishopric: 20, bishop: 21, admin: 99 }

  scope :active, -> { where(workflow_state: 'active') }

  def full_name
    [first_name, last_name].join(' ')
  end
end

