class BulletinConstraint
  def self.matches? request
    if Rails.env.production?
      request.subdomain == 'bulletin'
    else
      # In development, only match bulletin subdomain specifically
      request.subdomain == 'bulletin'
    end
  end

end