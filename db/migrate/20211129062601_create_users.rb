class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :google_id
      t.integer :role, default: 0
      t.boolean :prepper, default: false
      t.boolean :organist, default: false
      t.boolean :chorister, default: false
      t.boolean :conductor, default: false
      t.string :workflow_state, default: 'active'
      t.timestamps
    end
    add_index :users, :google_id, unique: true
  end
end
