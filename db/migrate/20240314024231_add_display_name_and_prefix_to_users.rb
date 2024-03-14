class AddDisplayNameAndPrefixToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :display_name, :string
    add_column :users, :prefix, :integer
  end
end
