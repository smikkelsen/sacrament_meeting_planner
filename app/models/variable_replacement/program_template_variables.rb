class VariableReplacement::ProgramTemplateVariables < VariableReplacement::Base

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)

    query = prep_conditional_block_variables(query)
    # query = collection_table(query)
    query = prep_iterative_variables(query)
    query = prep_built_in_variables(query)
    query = prep_collection_variables(query)
    query = prep_nested_object_variables(query)

    query
  end

  def self.system_vars
    vars = super
    vars = vars.reject {|v| v[:name].in? %w[Notes]}
  end
  # Override to provide smaller subset to program
  def self.collection_objects
    vars = super
    vars = vars.reject {|v| v[:obj].in? %w[releases sustainings business] }
    vars
  end
end