class CreateHymns < ActiveRecord::Migration[6.1]
  def change
    create_table :hymns do |t|
      t.string :name
      t.integer :page
      t.integer :category

      t.timestamps
    end
  end
end
