class CreateAccountSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :account_settings do |t|
      t.string :name
      t.string :value

      t.timestamps
    end
  end
end
