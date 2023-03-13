json.templates do
  json.array! @templates do |p|
    json.partial! p, partial: "/templates/template.json.jbuilder", as: :template
  end
end