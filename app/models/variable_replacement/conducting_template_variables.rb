class VariableReplacement::ConductingTemplateVariables < VariableReplacement::Base

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    query = prep_conditional_block_variables(query)
    query = prep_iterative_variables(query)
    query = prep_built_in_variables(query)
    query = prep_collection_variables(query)
    query = prep_nested_object_variables(query)

    query
  end
end