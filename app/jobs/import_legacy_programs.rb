class ImportLegacyPrograms

  def initialize(year, json)
    @year = year
    @json = json
    init_vars
  end

  def init_vars
    @missing_users = { prepper: [], conductor: [], organist: [], chorister: [] }
    @missing_hymns = { opening: [], intermediate: [], sacrament: [], closing: [] }
    @programs = []
    @problems = {}
  end

  def perform
    @json.each do |j|
      j = j.with_indifferent_access
      p = Program.new
      p.date = Date.parse("#{j['Date']}-#{@year}")

      p.prep_id = lookup_user(:prepper, j['Prep'])
      p.conducting_id = lookup_user(:conductor, j['Conduct'])
      p.chorister_id = lookup_user(:chorister, j['Music']['Music Director'])
      p.organist_id = lookup_user(:organist, j['Music']['Organist'])

      p.opening_hymn_id = lookup_hymn(:opening, j['Music']['Opening Hymn']['Number'])
      p.sacrament_hymn_id = lookup_hymn(:sacrament, j['Music']['Sacrament Hymn']['Number'])
      p.intermediate_hymn_id = lookup_hymn(:intermediate, j['Music']['Intermediate Hymn']['Number'])
      p.closing_hymn_id = lookup_hymn(:closing, j['Music']['Closing Hymn']['Number'])

      p.opening_prayer = j["Speakers/Prayers/Topics"]['Opening']
      p.closing_prayer = j["Speakers/Prayers/Topics"]['Closing']

      p.notes = j['Notes']

      p.meeting_type = case j['Topic']
                       when 'Fast Sunday'
                         :fast_sunday
                       when 'Stake Conference'
                         :stake_conference
                       when 'Ward Conference'
                         :ward_conference
                       when 'General Conference'
                         :general_conference
                       else
                         :standard
                       end

      if p.valid?
        @programs << p
      else
        @problems[j['Date']] = p.errors.full_messages.join((' '))
      end
    rescue => e
      puts e.message
      puts j
    end

  end

  def lookup_user(attribute, name)
    attrs = {}
    attrs[attribute] = true
    users = User.where(attrs)
    match = nil
    users.each do |u|
      if name.include? u.last_name
        match = u.id
        break
      end
    end
    if match.nil?
      log_missing_user(attribute, name)
    end
    match
  end

  def lookup_hymn(type, page_number)
    hymn = Hymn.where(category: :hymn, page: page_number).first

    if hymn.nil?
      log_missing_hymn(type, page_number)
    end
    hymn
  end

  def log_missing_user(type, value)
    @missing_users[type] = (@missing_users[type] << value).uniq
  end

  def log_missing_hymn(type, value)
    @missing_hymns[type] = (@missing_hymns[type] << value).uniq
  end

end