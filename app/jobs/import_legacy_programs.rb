class ImportLegacyPrograms

  attr_reader :missing_hymns, :missing_users, :programs, :problems

  def initialize(year, json, opts={})
    @year = year
    @json = json
    @opts = opts
    init_vars
  end

  def init_vars
    @missing_users = { prepper: [], conductor: [], organist: [], chorister: [] }
    @missing_hymns = { opening: [], intermediate: [], sacrament: [], closing: [] }
    @programs = []
    @problems = {}
  end

  def test_run
    perform(true)
    puts "Missing Users"
    puts @missing_users

    puts "Missing Hymns"
    puts @missing_hymns

    puts "Problems"
    puts @problems
  end

  def perform(test = false)
    @json.each do |j|
      j = j.with_indifferent_access
      p = Program.new
      p.date = Date.parse("#{j['Date']}-#{@year}")

      p.prep_id = lookup_user(:prepper, j['Prep'])
      p.conducting_id = lookup_user(:conductor, j['Conduct'])
      p.chorister_id = lookup_user(:chorister, j['Music']['Music Director'])
      p.organist_id = lookup_user(:organist, j['Music']['Organist'])
      p.presiding_id = @opts[:presiding_id]

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
        if test
          @programs << p
        else
          p.save
          build_program_items(p, j)
        end
      else
        @problems[j['Date']] = p.errors.full_messages.join((' '))
      end
    rescue => e
      puts e.message
      puts j
    end

  end

  def build_program_items(program, json)
    content = json["Speakers/Prayers/Topics"]
    3.times.with_index do |i|
      speaker = content["Speaker #{i + 1}"]
      if speaker.present?
        program.program_items.create(key: speaker, item_type: :speaker)
      end
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
    else
      hymn.id
    end
  end

  def log_missing_user(type, value)
    @missing_users[type] = (@missing_users[type] << value).uniq
  end

  def log_missing_hymn(type, value)
    @missing_hymns[type] = (@missing_hymns[type] << value).uniq
  end

end