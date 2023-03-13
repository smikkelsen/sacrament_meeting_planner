class CreateTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :templates do |t|
      t.integer :template_type
      t.string :name
      t.text :body

      t.timestamps
    end
  end
end
