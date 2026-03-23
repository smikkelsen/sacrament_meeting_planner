class AdminConstraint
  def self.matches? request
    if Rails.env.production?
      request.subdomain == 'admin'
    else
      # In development, match admin subdomain OR no subdomain (localhost)
      request.subdomain.blank? || request.subdomain == 'admin'
    end
  end

end