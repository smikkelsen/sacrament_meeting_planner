json.hymns do
  json.array! @hymns, :id, :name, :page, :category
end