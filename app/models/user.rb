class User < ApplicationRecord
  enum role: { pending: 0, participant: 1, music: 10, clerk: 19, bishopric: 20, bishop: 21, admin: 99 }, _suffix: true
  enum prefix: { brother: 0, sister: 1, bishop: 2, president: 3, elder: 4 }, _suffix: true

  scope :active, -> { where(workflow_state: 'active') }

  def active?
    workflow_state == 'active'
  end

  def full_name
    [first_name, last_name].join(' ')
  end

  def prefixed_name
    [prefix&.titleize, last_name].join(' ')
  end
end

