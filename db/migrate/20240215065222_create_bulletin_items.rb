class CreateBulletinItems < ActiveRecord::Migration[6.1]
  def change
    create_table :bulletin_items do |t|
      t.integer :item_type, null: false
      t.text :message
      t.date :date
      t.time :time
      t.boolean :archived, default: false
      t.integer :position, null: false

      t.timestamps
    end
  end
end
