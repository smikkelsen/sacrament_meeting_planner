json.bulletin_items do
  json.array! @bulletin_items do |p|
    json.partial! p, partial: "/bulletin_items/bulletin_item.json.jbuilder", as: :bulletin_item
  end
end
