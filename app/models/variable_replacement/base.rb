class VariableReplacement::Base
  include VariableReplacement::Helpers::Objects
  include VariableReplacement::Helpers::Formatters

  def self.system_vars
    [
      { name: 'MeetingType', display_name: 'Meeting Type', col_name: 'meeting_type', obj: 'program', group: 'Program' },
      { name: 'OpeningPrayer', display_name: 'Opening Prayer', col_name: 'opening_prayer', obj: 'program', group: 'Program' },
      { name: 'ClosingPrayer', display_name: 'Closing Prayer', col_name: 'closing_prayer', obj: 'program', group: 'Program' },
      { name: 'Notes', display_name: 'Notes', col_name: 'notes', obj: 'program', group: 'Program' },
      { name: 'Date', display_name: 'Program Date', col_name: 'date', obj: 'program', group: 'Program' },
    ]
  end

  def self.collection_objects
    program_items_attributes = %w[id key value item_type]
    bulletin_items_attributes = %w[item_type message date time position]
    vars = Array.new
    vars << { name: 'AllProgramItems', display_name: 'All Program Items', obj: 'all_program_items', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'BaseProgramItems', display_name: 'Base Program Items', obj: 'program_items', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'Speakers', display_name: 'Speakers', obj: 'speakers', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'MusicalNumbers', display_name: 'Musical Numbers', obj: 'musical_numbers', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'ProgramOthers', display_name: 'Program Others', obj: 'program_others', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'Announcements', display_name: 'Announcements', obj: 'announcements', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'Releases', display_name: 'Releases', obj: 'releases', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'Sustainings', display_name: 'Sustainings', obj: 'sustainings', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'Business', display_name: 'Business', obj: 'business', closing_tag: true, attributes: program_items_attributes }
    vars << { name: 'BulletinItems', display_name: 'Bulletin Items', obj: 'bulletin_items', closing_tag: true, attributes: bulletin_items_attributes }
    BulletinItem.item_types.each do |item_type, _v|
      titleized = item_type.titleize
      vars << { name: "#{titleized.gsub(' ', '')}BulletinItems", display_name: "#{titleized} Bulletin Items", obj: "#{item_type}_bulletin_items", attributes: bulletin_items_attributes }
    end
    vars
  end

  def self.nested_objects
    user_attributes = %w[id first_name last_name full_name email]
    hymn_attributes = %w[id name page category]
    vars = Array.new
    vars << { name: 'Presiding', display_name: 'Presiding', obj: 'presiding', attributes: user_attributes }
    vars << { name: 'Conducting', display_name: 'Conducting', obj: 'conducting', attributes: user_attributes }
    vars << { name: 'SacramentPrep', display_name: 'Sacrament Prep', obj: 'prep', attributes: user_attributes }
    vars << { name: 'Chorister', display_name: 'Chorister', obj: 'chorister', attributes: user_attributes }
    vars << { name: 'Organist', display_name: 'Organist', obj: 'organist', attributes: user_attributes }
    vars << { name: 'OpeningHymn', display_name: 'Opening Hymn', obj: 'opening_hymn', attributes: hymn_attributes }
    vars << { name: 'SacramentHymn', display_name: 'Sacrament Hymn', obj: 'sacrament_hymn', attributes: hymn_attributes }
    vars << { name: 'IntermediateHymn', display_name: 'Intermediate Hymn', obj: 'intermediate_hymn', attributes: hymn_attributes }
    vars << { name: 'ClosingHymn', display_name: 'Closing Hymn', obj: 'closing_hymn', attributes: hymn_attributes }
    vars
  end

  def initialize(args)
    @args = args
    @all_tag_names = %w[system_vars collection_objects nested_objects].map { |m| eval("VariableReplacement::Base::#{m}").map { |h| h[:name] } }
  end

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    raise 'must be called by subclass'
  end

  def parse_query(query, tags, replace_blank: true, closing_tag_body: nil)
    return '' if query.blank?
    tags.each do |tag|
      matches = if tag[:closing_tag]
                  query.scan(/\{!#{tag[:name]}(.*?)}(.*?)\{#{tag[:name]}!\}/m)
                else
                  query.scan(/\{!#{tag[:name]}(.*?)!\}/m)
                end

      matches.each do |match|
        properties = match[0]
        body = match[1] if tag[:closing_tag]

        formatters = properties.scan /formatters=\[(.*?)\]/
        formatters = formatters&.first&.first.split(',') if formatters.any?
        formatters = formatters.map { |f| f.strip } if formatters.any?

        attr = get_property_str(properties, 'attr')
        index = get_property_str(properties, 'index')
        max_blanks = get_property_str(properties, 'max_blanks')

        opts = {
          formatters: formatters,
          attr: attr,
          index: index,
          max_blanks: max_blanks
        }
        value = yield(tag, opts, body, query)
        if value.is_a? Hash
          value_h = value
          value = value_h[:value]
          body = value_h[:body] || body
        end
        str = if tag[:closing_tag]
                "{!#{tag[:name]}#{properties}}#{body}{#{tag[:name]}!}"
              else
                "{!#{tag[:name]}#{properties}!}"
              end
        query = query.gsub(str, value) unless value.blank? && !replace_blank
      end
    end
    query
  end

  def get_property_str(properties, key)
    prop = properties.scan /#{key}="(.*?)"/
    prop&.first&.first
  end

  def prep_conditional_block_variables(query)
    tags = [{ name: 'IF', closing_tag: true }]
    parse_query(query, tags) do |_tag, properties, body|
      max_blanks = properties[:max_blanks].to_i
      new_query = body
      new_query = prep_iterative_variables(new_query, false)
      new_query = prep_built_in_variables(new_query, false)
      new_query = prep_collection_variables(new_query, false)
      new_query = prep_nested_object_variables(new_query, false)
      remaining_tags  = new_query.scan(/\{!(.*?)!\}/)
      if remaining_tags.blank? || remaining_tags.count <= max_blanks
        new_query
      else
        ''
      end
    end
  end

  # These are nested objects that allows the user to access a value from a specific objects
  # Like if many program_items were used in the program, this would allow them to access program_item 2 for example.
  # be sure to add any new objects to collection_objects definition
  # {!Organist attr="full_name"!}
  def prep_nested_object_variables(query, replace_blank = true)
    parse_query(query, self.class.nested_objects, replace_blank: replace_blank) do |tag, properties|
      obj = eval(tag[:obj])
      attr = properties[:attr]
      return nil unless tag[:attributes].include? attr
      formatters = properties[:formatters] || []
      get_value(obj, attr, formatters)
    end
  end

  # These are collections of objects that allows the user to access a value from a specific member in the array of objects
  # Like if many program_items were used in the program, this would allow them to access program_item 2 for example.
  # be sure to add any new objects to collection_objects definition
  # {!AllProgramItems attr="key" index="1"!}
  def prep_collection_variables(query, replace_blank = true)
    tags = self.class.collection_objects.map { |t| t.delete(:closing_tag); t }
    parse_query(query, tags, replace_blank: replace_blank) do |tag, properties|
      collection = eval(tag[:obj])
      attr = properties[:attr]
      index = properties[:index].to_i
      obj = collection[index - 1]
      formatters = properties[:formatters] || []
      get_value(obj, attr, formatters)
    end
  end

  # These variables iterate on a collection of objects (like program_items, speakers, etc) and repeat the contents found
  # in the match, replacing each attribute variable it finds
  # {!Speakers}
  #   name: {!key!}
  #   topic: {!value!}
  # {Speakers!}
  def prep_iterative_variables(query, replace_blank = true)
    parse_query(query, self.class.collection_objects, replace_blank: replace_blank) do |tag, properties, body|
      collection = eval(tag[:obj])
      new_query = collection.map do |member|
        attr_tags = tag[:attributes].map { |a| { name: a, obj: member, col_name: a } }
        parse_query(body, attr_tags, replace_blank: replace_blank) do |tag, properties|
          obj = tag[:obj]
          attr = tag[:col_name]
          formatters = properties[:formatters] || []
          get_value(obj, attr, formatters)
        end
      end
      { value: new_query.join, closing_tag_body: properties[:closing_tag_body] }
    end
  end

  #{!!collection_table|collection name|table_classes|[{!attribute1}&"literal string or html"&{!attribute2}]!!}
  # def collection_table(query)
  #   matches = query.scan(/\{!!collection_table\|(.+?)!!\}/m) unless query.nil?
  #   matches&.each do |match|
  #     properties = match[0]&.split('|')
  #     obj_name = properties[0]
  #     table_classes = properties[1]
  #     attr_str = match[0]&.scan(/#{obj_name}\|#{table_classes}\|\[(.+?)\]/m)[0][0]
  #     attr_str.gsub!("},", '}%del%').gsub!('",', '"%del%')
  #     attributes = attr_str.split("%del%")
  #     # Security Check (make sure they can only access data I say they can...)
  #     perm = self.class.collection_objects.find { |a| a[:obj].casecmp(obj_name) == 0 }
  #     next unless perm
  #     objects = eval(obj_name)
  #     attribute_matches = contents.scan(/\{!(.+?)\}/) unless contents.nil?
  #     objects.each do |obj|
  #       obj_contents = contents
  #       attribute_matches&.each do |attribute_match|
  #         attribute = attribute_match.first
  #         next unless perm[:attributes].include?(attribute.split('|')[0])
  #         value = get_value(obj, attribute)
  #         obj_contents = obj_contents.gsub("{!#{attribute}}", value) unless value.blank? && !replace_blank
  #       end
  #       new_contents = new_contents + obj_contents
  #     end
  #     if objects.empty? && !replace_blank # don't remove the contents if replace_blank is false
  #       new_contents = contents
  #     end
  #     query = query.gsub("{!!#{obj_name}}#{contents}{!!end}", new_contents)
  #   end
  #   query
  # end

  # These are built in variables (defined in the 'system_vars' class method)
  # {!OpeningPrayer}
  def prep_built_in_variables(query, replace_blank = true)
    parse_query(query, self.class.system_vars, replace_blank: replace_blank) do |tag, properties|
      obj = eval(tag[:obj])
      attr = tag[:col_name]
      formatters = properties[:formatters] || []
      get_value(obj, attr, formatters)
    end
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