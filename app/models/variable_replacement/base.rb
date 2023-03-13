class VariableReplacement::Base
  include VariableReplacement::Helpers::Objects
  include VariableReplacement::Helpers::Formatters

  def self.system_vars
    raise 'must be called by subclass'
  end

  def initialize(args)
    @args = args
  end

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    raise 'must be called by subclass'
  end

  # These are special nested objects that allows the user to access a value from a specific array of objects
  # Like if many program_items were used in the program, this would allow them to access program_item 2 for example.
  # be sure to add any new objects to nested_objects definition
  # {!program_items[1][key]}
  # {!program_items[1][value]}
  # {!speakers[1][key]}
  def prep_nested_obj_variables(query)
    unless query.nil?
      matches = query.scan(/\{!(.+?)\[(\d+?)\]\[(.+?)\]\}/)
      matches.each do |match|
        obj = match[0].to_s.downcase
        p_index = match[1].to_i - 1
        attribute = match[2].to_s.downcase

        # Security Check (make sure they can only access data I say they can...)
        perm = nested_objects.find { |a| a[:obj].casecmp(obj) == 0 }
        if perm && perm[:attributes].include?(attribute)

          obj = eval(obj)
          if obj.nil?
            value = ''
          else
            value = obj[p_index].attributes[attribute].to_s rescue nil
          end
          value ||= ''
          query = query.gsub("{!#{match[0]}[#{match[1]}][#{match[2]}]}", value) rescue ''

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
  def prep_iterative_variables(query)
    matches = query.scan(/\{!!(.+?)}(.+?){!!end}/) unless query.nil?

    matches&.each do |match|
      obj_name = match[0]
      contents = match[1]
      new_contents = ''
      # Security Check (make sure they can only access data I say they can...)
      perm = nested_objects.find { |a| a[:obj].casecmp(obj_name) == 0 }
      next unless perm
      objects = eval(obj_name)
      attribute_matches = contents.scan(/\{!(.+?)\}/) unless contents.nil?
      objects.each do |obj|
        obj_contents = contents
        attribute_matches&.each do |attribute_match|
          attribute = attribute_match.first
          next unless perm[:attributes].include?(attribute)
          if obj.nil?
            value = ''
          else
            value = obj.attributes[attribute].to_s rescue nil
          end
          value ||= ''
          obj_contents = obj_contents.gsub("{!#{attribute}}", value)
        end
        new_contents = new_contents + obj_contents
      end
      query = query.gsub( "{!!#{obj_name}}#{contents}{!!end}", new_contents )
    end
    query
  end

  # These are built in variables (defined in the 'system_vars' class method)
  # {!OpeningPrayer}
  def prep_built_in_variables(query)
    matches = query.scan(/\{!(.+?)\}/) unless query.nil?

    # Check matches against built in variables
    matches&.each do |match|
      match = match.first
      var = self.class.system_vars.find { |a| a[:name].casecmp(match) == 0 }
      if var
        obj = eval(var[:obj])
        if obj.nil?
          value = ''
        else
          method_args = var[:args] || []
          value = obj.send(var[:col_name], *method_args).to_s rescue ''
          formatters = var[:formatters] || []
          value = add_formatters(value, formatters)
        end
        value ||= ''
        query = query.gsub(/{!#{var[:name]}}/i, value) rescue ''
      end
    end

    query
  end

  def add_formatters(value, formatters)
    formatters.each do |format|
      value = send(format, value)
    end
    value
  end

  def nested_objects
    vars = Array.new
    vars << { obj: 'program_items', attributes: %w[id key value item_type] }
    vars << { obj: 'speakers', attributes: %w[id key value item_type] }
    vars << { obj: 'musical_numbers', attributes: %w[id key value item_type] }
    vars << { obj: 'program_others', attributes: %w[id key value item_type] }
    vars << { obj: 'announcements', attributes: %w[id key value item_type] }
    vars << { obj: 'releases', attributes: %w[id key value item_type] }
    vars << { obj: 'sustainings', attributes: %w[id key value item_type] }
  end

end