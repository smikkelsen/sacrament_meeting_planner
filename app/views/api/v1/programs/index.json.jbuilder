json.programs do
  json.array! @programs do |p|
    json.id p.id
    json.date p.date
    json.meeting_type p.meeting_type
    json.opening_prayer p.opening_prayer
    json.closing_prayer p.closing_prayer
    json.prep_id p.prep_id
    json.chorister_id p.chorister_id
    json.organist_id p.organist_id
    json.opening_hymn_id p.opening_hymn_id
    json.sacrament_hymn_id p.sacrament_hymn_id
    json.intermediate_hymn_id p.intermediate_hymn_id
    json.closing_hymn_id p.closing_hymn_id
    json.presiding_id p.presiding_id
    json.conducting_id p.conducting_id
    json.prep do
      json.id p.prep&.id
      json.first_name p.prep&.first_name
      json.last_name p.prep&.last_name
      json.full_name p.prep&.full_name
      json.role p.prep&.role
      json.email p.prep&.email
    end
    json.presiding do
      json.id p.presiding&.id
      json.first_name p.presiding&.first_name
      json.last_name p&.presiding&.last_name
      json.full_name p.presiding&.full_name
      json.role p.presiding&.role
      json.email p.presiding&.email
    end
    json.conducting do
      json.id p.conducting&.id
      json.first_name p.conducting&.first_name
      json.last_name p.conducting&.last_name
      json.full_name p.conducting&.full_name
      json.role p.conducting&.role
      json.email p.conducting&.email
    end
    json.chorister do
      json.id p.chorister&.id
      json.first_name p.chorister&.first_name
      json.last_name p.chorister&.last_name
      json.full_name p.chorister&.full_name
      json.role p.chorister&.role
      json.email p.chorister&.email
    end
    json.organist do
      json.id p.organist&.id
      json.first_name p.organist&.first_name
      json.last_name p.organist&.last_name
      json.full_name p.organist&.full_name
      json.role p.organist&.role
      json.email p.organist&.email
    end
    json.opening_hymn do
      json.id p.opening_hymn&.id
      json.name p.opening_hymn&.name
      json.page p.opening_hymn&.page
    end
    json.sacrament_hymn do
      json.id p.sacrament_hymn&.id
      json.name p.sacrament_hymn&.name
      json.page p.sacrament_hymn&.page
    end
    json.intermediate_hymn do
      json.id p.intermediate_hymn&.id
      json.name p.intermediate_hymn&.name
      json.page p.intermediate_hymn&.page
    end
    json.closing_hymn do
      json.id p.closing_hymn&.id
      json.name p.closing_hymn&.name
      json.page p.closing_hymn&.page
    end
    json.program_items p.program_items do |pi|
      json.id pi.id
      json.item_type pi.item_type
      json.key pi.key
      json.value pi.value
    end
  end
end