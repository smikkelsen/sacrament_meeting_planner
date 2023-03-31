class VariableReplacement::Base
  include VariableReplacement::Helpers::Objects
  include VariableReplacement::Helpers::Formatters

  def self.system_vars
    [
      { name: 'OpeningPrayer', display_name: 'Opening Prayer', col_name: 'opening_prayer', obj: 'program', group: 'Program' },
      { name: 'ClosingPrayer', display_name: 'Closing Prayer', col_name: 'closing_prayer', obj: 'program', group: 'Program' },
      { name: 'Notes', display_name: 'Notes', col_name: 'notes', obj: 'program', group: 'Program' },
      { name: 'Date', display_name: 'Program Date', col_name: 'date', obj: 'program', group: 'Program' },
    ]
  end

  def self.collection_objects
    program_items_attributes = %w[id key value item_type]
    vars = Array.new
    vars << {display_name: 'All Program Items', obj: 'all_program_items', attributes: program_items_attributes }
    vars << {display_name: 'Base Program Items', obj: 'program_items', attributes: program_items_attributes }
    vars << {display_name: 'Speakers', obj: 'speakers', attributes: program_items_attributes }
    vars << {display_name: 'Musical Numbers', obj: 'musical_numbers', attributes: program_items_attributes }
    vars << {display_name: 'Program Others', obj: 'program_others', attributes: program_items_attributes }
    vars << {display_name: 'Announcemetns', obj: 'announcements', attributes: program_items_attributes }
    vars << {display_name: 'Releases', obj: 'releases', attributes: program_items_attributes }
    vars << {display_name: 'Sustainings', obj: 'sustainings', attributes: program_items_attributes }
    vars
  end

  def self.nested_objects
    user_attributes = %w[id first_name last_name full_name email]
    hymn_attributes = %w[id name page category]
    vars = Array.new
    vars << {display_name: 'Presiding', obj: 'presiding', attributes: user_attributes }
    vars << {display_name: 'Conducting', obj: 'conducting', attributes: user_attributes }
    vars << {display_name: 'Sacrament Prep', obj: 'prep', attributes: user_attributes }
    vars << {display_name: 'Chorister', obj: 'chorister', attributes: user_attributes }
    vars << {display_name: 'Organist', obj: 'organist', attributes: user_attributes }
    vars << {display_name: 'Opening Hymn', obj: 'opening_hymn', attributes: hymn_attributes }
    vars << {display_name: 'Sacrament Hymn', obj: 'sacrament_hymn', attributes: hymn_attributes }
    vars << {display_name: 'Intermediate Hymn', obj: 'intermediate_hymn', attributes: hymn_attributes }
    vars << {display_name: 'Closing Hymn', obj: 'closing_hymn', attributes: hymn_attributes }
    vars
  end

  def initialize(args)
    @args = args
  end

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    raise 'must be called by subclass'
  end

  def prep_conditional_block_variables(query)
    matches = query.scan(/\{!!if_present\}(.+?)\{!!end_if_present\}/m) unless query.nil?
    matches&.each do |match|
      contents = match[0]
      new_contents = contents
      new_contents = prep_iterative_variables(new_contents, false)
      new_contents = prep_built_in_variables(new_contents, false)
      new_contents = prep_collection_variables(new_contents, false)
      new_contents = prep_nested_object_variables(new_contents, false)
      matches = new_contents.scan(/\{!(.+?)\}/)
      val = matches.any? ? '' : contents
      query = query.gsub("{!!if_present}#{contents}{!!end_if_present}", val) # remove the whole block

    end
    query
  end

  # These are nested objects that allows the user to access a value from a specific objects
  # Like if many program_items were used in the program, this would allow them to access program_item 2 for example.
  # be sure to add any new objects to collection_objects definition
  # {!program_items[1][key]}
  # {!program_items[1][value]}
  # {!speakers[1][key]}
  def prep_nested_object_variables(query, replace_blank = true)
    unless query.nil?
      matches = query.scan(/\{!(.+?)\[(.+?)\]\}/)
      matches.each do |match|
        obj = match[0].to_s.downcase
        attribute = match[1].to_s.downcase

        # Security Check (make sure they can only access data I say they can...)
        perm = self.class.nested_objects.find { |a| a[:obj].casecmp(obj) == 0 }
        if perm && perm[:attributes].include?(attribute.split('|')[0])

          obj = eval(obj)
          value = get_value(obj, attribute)
          query = query.gsub("{!#{match[0]}[#{match[1]}]}", value) unless value.blank? && !replace_blank
          query
        end
      end

    end
    query
  end

  # These are collections of objects that allows the user to access a value from a specific member in the array of objects
  # Like if many program_items were used in the program, this would allow them to access program_item 2 for example.
  # be sure to add any new objects to collection_objects definition
  # {!program_items[1][key]}
  # {!program_items[1][value]}
  # {!speakers[1][key]}
  def prep_collection_variables(query, replace_blank = true)
    unless query.nil?
      matches = query.scan(/\{!(.+?)\[(\d+?)\]\[(.+?)\]\}/)
      matches.each do |match|
        obj = match[0].to_s.downcase
        p_index = match[1].to_i - 1
        attribute = match[2].to_s.downcase

        # Security Check (make sure they can only access data I say they can...)
        perm = self.class.collection_objects.find { |a| a[:obj].casecmp(obj) == 0 }
        if perm && perm[:attributes].include?(attribute)

          obj = eval(obj)
          value = get_value(obj[p_index], attribute)
          query = query.gsub("{!#{match[0]}[#{match[1]}][#{match[2]}]}", value) unless value.blank? && !replace_blank
          query
        end
      end

    end
    query
  end

  # These variables iterate on a collection of objects (like program_items, speakers, etc) and repeat the contents found
  # in the match, replacing each attribute variable it finds
  # {!!speakers}
  #   name: {!key}
  #   topic: {!value}
  # {!!end}
  def prep_iterative_variables(query, replace_blank = true)
    matches = query.scan(/\{!!(.+?)\}(.+?)\{!!end\}/m) unless query.nil?
    matches&.each do |match|
      obj_name = match[0]
      contents = match[1]
      new_contents = ''
      # Security Check (make sure they can only access data I say they can...)
      perm = self.class.collection_objects.find { |a| a[:obj].casecmp(obj_name) == 0 }
      next unless perm
      objects = eval(obj_name)
      attribute_matches = contents.scan(/\{!(.+?)\}/) unless contents.nil?
      objects.each do |obj|
        obj_contents = contents
        attribute_matches&.each do |attribute_match|
          attribute = attribute_match.first
          next unless perm[:attributes].include?(attribute.split('|')[0])
          value = get_value(obj, attribute)
          obj_contents = obj_contents.gsub("{!#{attribute}}", value) unless value.blank? && !replace_blank
        end
        new_contents = new_contents + obj_contents
      end
      if objects.empty? && !replace_blank # don't remove the contents if replace_blank is false
        new_contents = contents
      end
      query = query.gsub("{!!#{obj_name}}#{contents}{!!end}", new_contents)
    end
    query
  end

  # These are built in variables (defined in the 'system_vars' class method)
  # {!OpeningPrayer}
  def prep_built_in_variables(query, replace_blank = true)
    matches = query.scan(/\{!(.+?)\}/) unless query.nil?

    # Check matches against built in variables
    matches&.each do |match|
      match = match.first
      var = self.class.system_vars.find { |a| a[:name].casecmp(match.split('|')[0]) == 0 }
      if var
        obj = eval(var[:obj])
        formatters = var[:formatters] || []
        attr = [var[:col_name]].concat(Array.wrap(match.split('|')[1])).join('|')
        value = get_value(obj, attr, formatters)
        query = query.gsub("{!#{match}}", value) unless value.blank? && !replace_blank
        query
      end
    end

    query
  end

  def get_value(object, attribute_str, formatters = [])
    arr = attribute_str.split('|')
    attribute = arr[0]
    if arr.length > 1
      formatters = arr[1].split(',') + formatters
    end
    value = object.send(attribute).to_s rescue ''
    formatters.each do |format|
      value = send(format, value) rescue value
    end
    value
  end

end