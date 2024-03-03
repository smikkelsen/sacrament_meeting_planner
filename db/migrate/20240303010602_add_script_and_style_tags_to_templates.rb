class AddScriptAndStyleTagsToTemplates < ActiveRecord::Migration[6.1]
  def change
    add_column :templates, :scripts, :text
    add_column :templates, :styles, :text
  end
end
