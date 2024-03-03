class BulletinConstraint
  def self.matches? request
    request.subdomain == 'bulletin' ||
      !Rails.env.production?
  end
    
end