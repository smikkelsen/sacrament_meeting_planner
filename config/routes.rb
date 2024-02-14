Rails.application.routes.draw do

  constraints(ProgramConstraint) do
    root to: 'programs#public', as: :public_root
    get 'program', to: 'programs#public', as: :public_program
  end

  constraints(AdminConstraint) do

    root to: 'pages#programs'

    get 'session', to: 'sessions#new', as: :new_session
    get 'session/create', to: 'sessions#create', as: :create_session
    delete 'session/destroy', to: 'sessions#destroy', as: :destroy_session

    get 'programs', to: 'pages#programs', as: :programs_page
    get 'bulk_edit', to: 'pages#bulk_edit', as: :bulk_edit_page
    get 'hymns', to: 'pages#hymns', as: :hymns_page
    get 'templates', to: 'pages#templates', as: :templates_page
    get 'music', to: 'pages#music', as: :music_page
    get 'dashboard', to: 'pages#dashboard', as: :dashboard_page
    get 'reports', to: 'pages#reports', as: :reports_page
    get 'users', to: 'pages#users', as: :users_page

    get '/programs/:id/templates/:template_id/generate', to: 'programs#generate_template', as: :generate_program_template_page

    namespace :api do
      namespace :v1 do
        resources :hymns, only: [:index, :show]
        get '/templates/list_vars/:template_type', to: 'templates#list_vars'
        resources :templates, only: [:index, :show, :create, :update]
        resources :programs, only: [:index, :show, :update]
        post '/programs/bulk_edit', to: 'programs#bulk_edit', as: :bulk_edit_programs
        get '/programs/:id/templates/:template_id/generate', to: 'programs#generate_template', as: :generate_program_template_page
        get '/users/current', to: 'users#current'
        get '/users/user_roles', to: 'users#user_roles', as: :user_roles
        resources :users, only: [:index, :show, :update]
        get '/trello/list_cards/:list_type', to: 'trello#list_cards'
      end
    end

  end

end
