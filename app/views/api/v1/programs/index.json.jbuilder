json.programs do
  json.array! @programs do |p|
    json.partial! p, partial: "/programs/program.json.jbuilder", as: :program
  end
end