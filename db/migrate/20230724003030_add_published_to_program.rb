class AddPublishedToProgram < ActiveRecord::Migration[6.1]
  def change
    add_column :programs, :published, :boolean, default: false
  end
end
