json.users do
  json.array! @users do |p|
    json.partial! p, partial: "/users/user.json.jbuilder", as: :user
  end
end
