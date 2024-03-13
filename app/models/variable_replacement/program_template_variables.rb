class VariableReplacement::ProgramTemplateVariables < VariableReplacement::Base

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