class VariableReplacement::ConductingTemplateVariables < VariableReplacement::Base
  def self.system_vars
    VariableReplacement::ProgramTemplateVariables.system_vars
  end

  # +query+: the string with {!var_name} to replace
  def prep_query_string(query)
    query = prep_built_in_variables(query)
    query = prep_nested_obj_variables(query)

    query
  end
end