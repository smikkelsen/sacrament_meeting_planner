class CreatePrograms < ActiveRecord::Migration[6.1]
  def change
    create_table :programs do |t|
      t.integer :meeting_type, null: false
      t.date :date, null: false
      t.integer :presiding_id
      t.integer :conducting_id
      t.integer :prep_id
      t.integer :chorister_id
      t.integer :organist_id
      t.integer :opening_hymn_id
      t.integer :intermediate_hymn_id
      t.integer :sacrament_hymn_id
      t.integer :closing_hymn_id
      t.string :opening_prayer
      t.string :closing_prayer
      t.text :notes

      t.timestamps
    end
  end
end
