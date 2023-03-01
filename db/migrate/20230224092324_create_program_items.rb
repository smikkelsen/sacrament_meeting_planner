class CreateProgramItems < ActiveRecord::Migration[6.1]
  def change
    create_table :program_items do |t|
      t.string :key
      t.string :value
      t.integer :item_type
      t.integer :program_id

      t.timestamps
    end
  end
end
