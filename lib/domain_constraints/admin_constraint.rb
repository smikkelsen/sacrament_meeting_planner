class AdminConstraint
  def self.matches? request
    request.subdomain == 'admin' ||
      !Rails.env.production?
  end
    
end