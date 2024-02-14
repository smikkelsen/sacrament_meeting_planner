class ProgramConstraint
  def self.matches? request
    request.subdomain == 'program' ||
      !Rails.env.production?
  end
    
end