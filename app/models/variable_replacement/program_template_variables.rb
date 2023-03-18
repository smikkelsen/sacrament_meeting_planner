class VariableReplacement::ProgramTemplateVariables < VariableReplacement::Base
  def self.system_vars
    [
      { name: 'OpeningPrayer', display_name: 'Opening Prayer', col_name: 'opening_prayer', obj: 'program', group: 'Program' },
      { name: 'ClosingPrayer', display_name: 'Closing Prayer', col_name: 'closing_prayer', obj: 'program', group: 'Program' },
      { name: 'Notes', display_name: 'Notes', col_name: 'notes', obj: 'program', group: 'Program' },
      { name: 'Date', display_name: 'Program Date', col_name: 'date', obj: 'program', group: 'Program' },
    ]
  end

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    query = prep_conditional_block_variables(query)
    query = prep_iterative_variables(query)
    query = prep_built_in_variables(query)
    query = prep_collection_variables(query)
    query = prep_nested_object_variables(query)

    query
  end

  # Override to provide smaller subset to program
  def nested_objects
    vars = Array.new
    vars << { obj: 'speakers', attributes: %w[id key value item_type] }
    vars << { obj: 'musical_numbers', attributes: %w[id key value item_type] }
    vars << { obj: 'program_others', attributes: %w[id key value item_type] }
  end
end