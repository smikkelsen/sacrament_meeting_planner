require 'trello'

Trello.configure do |config|
  config.developer_public_key = Rails.application.credentials.dig(:trello, :developer_key)
  config.member_token = Rails.application.credentials.dig(:trello, :member_token)
end