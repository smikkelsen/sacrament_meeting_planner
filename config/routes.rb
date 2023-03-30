Rails.application.routes.draw do

  root to: 'pages#dashboard'

  get 'session', to: 'sessions#new', as: :new_session
  get 'session/create', to: 'sessions#create', as: :create_session
  delete 'session/destroy', to: 'sessions#destroy', as: :destroy_session

  get 'programs', to: 'pages#programs', as: :programs_page
  get 'hymns', to: 'pages#hymns', as: :hymns_page
  get 'templates', to: 'pages#templates', as: :templates_page
  get 'music', to: 'pages#music', as: :music_page
  get 'dashboard', to: 'pages#dashboard', as: :dashboard_page

  get '/programs/:id/templates/:template_id/generate', to: 'programs#generate_template', as: :generate_program_template_page

  namespace :api do
    namespace :v1 do
      resources :hymns, only: [:index, :show]
      resources :templates, only: [:index, :show, :create, :update]
      resources :programs, only: [:index, :show, :update]
      get '/programs/:id/templates/:template_id/generate', to: 'programs#generate_template', as: :generate_program_template_page
      get '/users/current', to: 'users#current'
      resources :users, only: [:index, :show]
      get '/trello/list_cards/:list_type', to: 'trello#list_cards'

    end
  end

end
