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
      vars << { name: "#{titleized.gsub(' ', '')}BulletinItems", display_name: "#{titleized} Bulletin Items", obj: "#{item_type}_bulletin_items", closing_tag: true, attributes: bulletin_items_attributes }
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
    query = prep_conditional_block_variables(query)
    query = collection_table(query)
    query = prep_iterative_variables(query)
    query = prep_built_in_variables(query)
    query = prep_collection_variables(query)
    query = prep_nested_object_variables(query)

    query
  end

  def parse_query(query, tags, replace_blank: true)
    return '' if query.blank?
    replaced_query = query
    tags.each do |tag|
      matches = if tag[:closing_tag]
                  query.scan(/\{!#{tag[:name]}(.*?)}(.*?)\{#{tag[:name]}!\}/m)
                else
                  query.enum_for(:scan, /\{!#{tag[:name]}(.*?)!\}/m).map { Regexp.last_match.begin(0) }
                end

      matches.each do |match|
        if tag[:closing_tag]
          properties = match[0]
          body = match[1] if tag[:closing_tag]
        else
          full_tag = scan_for_closing(query, match)
          properties = full_tag[(tag[:name].length + 2)..-3]
        end
        opts = opts_from_properties(properties)
        replace_blank = ActiveModel::Type::Boolean.new.cast(opts[:replace_blank]) || replace_blank

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
        replaced_query = replaced_query.gsub(str, value) unless value.blank? && !replace_blank
      end
    end
    replaced_query
  end

  def opts_from_properties(properties)
    opts = {}
    new_properties = properties
    str_matches = new_properties.scan /([a-z_]*?)="(.*?)"/m
    str_matches.each do |m|
      opts[m[0].to_sym] = m[1]
      new_properties = new_properties.gsub("#{m[0]}=\"#{m[1]}\"", '')
    end
    loop do
      arr_matches = new_properties.scan /([a-z_]*)=(\[.*)/m
      break unless arr_matches.any?
      arr_matches.each do |m|
        index = new_properties.index(m[1])
        full_tag = scan_for_closing(new_properties, index)
        opts[m[0].to_sym] = full_tag[1..-2].split(',').map { |f| f.strip }
        new_properties = new_properties.gsub("#{m[0]}=#{full_tag}", '')
      end
    end
    str_matches = new_properties.scan /([a-z_]*?)=(true|false)/m
    str_matches.each do |m|
      opts[m[0].to_sym] = m[1]
      new_properties = new_properties.gsub("#{m[0]}=#{m[1]}", '')
    end
    opts
  end

  def scan_for_closing(str, start_index)
    end_index = nil
    opening_char = str[start_index]
    closing_char = case str[start_index]
                   when '{'
                     '}'
                   when '['
                     ']'
                   when '<'
                     '>'
                   end
    opening_count = 0
    closing_count = 0
    str[start_index..-1].chars.each_with_index do |c, i|
      if c == closing_char
        closing_count += 1
      elsif c == opening_char
        opening_count += 1
      end
      if closing_count == opening_count
        end_index = start_index + i
        break
      end
    end
    if end_index
      str[start_index..end_index]
    else
      str
    end
  end

  def prep_conditional_block_variables(query)
    tags = [{ name: 'IF', closing_tag: true }]
    parse_query(query, tags) do |_tag, properties, body|
      max_blanks = properties[:max_blanks].to_i
      new_query = body
      new_query = collection_table(new_query, false)
      new_query = prep_iterative_variables(new_query, false)
      new_query = prep_built_in_variables(new_query, false)
      new_query = prep_collection_variables(new_query, false)
      new_query = prep_nested_object_variables(new_query, false)
      remaining_tags = new_query.scan(/\{!(.*?)!\}/)
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

  #{!CollectionTable
  #   collection="bulletin_items"
  #   id="tableId"
  #   classes="class1 class2"
  #   columns=[{!attribute1!}, "literal string or html", attribute2]
  #   headings=[heading1, heading2, heading3]
  # !}
  def collection_table(query, replace_blank = true)
    tags = [{ name: 'CollectionTable' }]
    parse_query(query, tags, replace_blank: replace_blank) do |_tag, properties|
      collection = eval(properties[:collection])
      collection_tag = self.class.collection_objects.find { |h| h[:obj] == properties[:collection] }

      table_id = properties[:id]
      table_classes = properties[:class]
      columns = strip_quotes_from_arr(properties[:columns])
      column_classes = strip_quotes_from_arr(properties[:column_classes])
      headings = strip_quotes_from_arr(properties[:headings])
      value = ["<table id=\"#{table_id}\" class=\"#{table_classes}\">"]
      if headings&.size == columns&.size
        value << "<thead><tr>"
        headings&.each { |h| value << "<th>#{h}</th>" }
        value << "</tr></thead>"
      end
      value << "<tbody>"
      collection.each do |member|
        value << "<tr>"
        columns.each_with_index do |column, index|
          column_class = column_classes&.[](index)
          attr_tags = collection_tag[:attributes].map { |a| { name: a, obj: member } }
          v = parse_query(column, attr_tags, replace_blank: replace_blank) do |tag, properties|
            obj = tag[:obj]
            attr = tag[:name]
            formatters = properties[:formatters] || []
            get_value(obj, attr, formatters)
          end
          value << "<td class='#{column_class}'>#{v}</td>"
        end
        value << "</tr>"
      end
      value << "</tbody></table>"
      value.join
    end
  end

  def strip_quotes_from_arr(arr)
    arr&.map do |c|
      if (c[0] == c[-1]) && c[0].in?(%w[' "])
        c = c[1..-2]
      end
      c
    end
  end
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

  def get_value(object, attribute, formatters = [])
    attribute = object.send(attribute).to_s unless object.nil?
    formatters.each do |format|
      attribute = send(format, attribute) rescue value
    end
    attribute
  rescue
    ''
  end

end