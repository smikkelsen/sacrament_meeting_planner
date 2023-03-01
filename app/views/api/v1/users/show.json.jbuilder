json.user do
  json.(@user, :id, :first_name, :last_name, :full_name, :email, :role, :prepper, :organist, :chorister, :conductor)
end