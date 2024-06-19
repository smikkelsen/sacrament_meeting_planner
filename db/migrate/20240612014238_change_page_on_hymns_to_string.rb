class ChangePageOnHymnsToString < ActiveRecord::Migration[6.1]
  def up
    change_column :hymns, :page, :string
  end

  def down
    change_column :hymns, :page, :integer
  end
end
