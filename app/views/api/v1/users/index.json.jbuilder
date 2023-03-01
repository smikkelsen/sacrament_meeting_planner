json.users do
  json.array! @users do |p|
    json.id p.id
    json.first_name p.first_name
    json.last_name p.last_name
    json.full_name p.full_name
    json.role p.role
    json.email p.email
    json.prepper p.prepper
    json.organist p.organist
    json.chorister p.chorister
    json.conductor p.conductor
  end
end