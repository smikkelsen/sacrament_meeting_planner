class AddPdfSettingsToTemplates < ActiveRecord::Migration[6.1]
  def change
    add_column :templates, :pdf_settings, :jsonb
  end
end
