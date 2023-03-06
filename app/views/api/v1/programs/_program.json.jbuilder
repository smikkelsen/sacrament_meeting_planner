  json.id program.id
  json.date program.date
  json.meeting_type program.meeting_type
  json.opening_prayer program.opening_prayer
  json.closing_prayer program.closing_prayer
  json.notes program.notes
  json.is_next program.next_program?
  json.prep do
    json.id program.prep&.id
    json.first_name program.prep&.first_name
    json.last_name program.prep&.last_name
    json.full_name program.prep&.full_name         
    json.role program.prep&.role
    json.email program.prep&.email
  end
  json.presiding do
    json.id program.presiding&.id
    json.first_name program.presiding&.first_name
    json.last_name p&.presiding&.last_name
    json.full_name program.presiding&.full_name
    json.role program.presiding&.role
    json.email program.presiding&.email
  end
  json.conducting do
    json.id program.conducting&.id
    json.first_name program.conducting&.first_name
    json.last_name program.conducting&.last_name
    json.full_name program.conducting&.full_name
    json.role program.conducting&.role
    json.email program.conducting&.email
  end
  json.chorister do
    json.id program.chorister&.id
    json.first_name program.chorister&.first_name
    json.last_name program.chorister&.last_name
    json.full_name program.chorister&.full_name
    json.role program.chorister&.role
    json.email program.chorister&.email
  end
  json.organist do
    json.id program.organist&.id
    json.first_name program.organist&.first_name
    json.last_name program.organist&.last_name
    json.full_name program.organist&.full_name
    json.role program.organist&.role
    json.email program.organist&.email
  end
  json.opening_hymn do
    json.id program.opening_hymn&.id
    json.name program.opening_hymn&.name
    json.page program.opening_hymn&.page
  end
  json.sacrament_hymn do
    json.id program.sacrament_hymn&.id
    json.name program.sacrament_hymn&.name
    json.page program.sacrament_hymn&.page
  end
  json.intermediate_hymn do
    json.id program.intermediate_hymn&.id
    json.name program.intermediate_hymn&.name
    json.page program.intermediate_hymn&.page
  end
  json.closing_hymn do
    json.id program.closing_hymn&.id
    json.name program.closing_hymn&.name
    json.page program.closing_hymn&.page
  end
  json.program_items program.program_items.order(:created_at) do |pi|
    json.id pi.id
    json.item_type pi.item_type
    json.key pi.key
    json.value pi.value
  end

