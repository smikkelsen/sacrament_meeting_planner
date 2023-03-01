Rails.application.routes.draw do

  root to: 'pages#dashboard'

  get 'session', to: 'sessions#new', as: :new_session
  get 'session/create', to: 'sessions#create', as: :create_session
  delete 'session/destroy', to: 'sessions#destroy', as: :destroy_session

  get 'programs', to: 'pages#programs', as: :programs_page
  get 'hymns', to: 'pages#hymns', as: :hymns_page
  get 'music', to: 'pages#music', as: :music_page
  get 'dashboard', to: 'pages#dashboard', as: :dashboard_page

  namespace :api do
    namespace :v1 do
      resources :hymns, only: [:index, :show]
      resources :programs, only: [:index, :show]
      resources :users, only: [:index, :show]
    end
  end

end
