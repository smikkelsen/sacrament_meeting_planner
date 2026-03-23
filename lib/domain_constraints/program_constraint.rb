class ProgramConstraint
  def self.matches? request
    if Rails.env.production?
      request.subdomain == 'program'
    else
      # In development, only match program subdomain specifically
      request.subdomain == 'program' || request.subdomain == 'public'
    end
  end

end