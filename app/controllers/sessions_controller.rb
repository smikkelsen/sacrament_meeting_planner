class SessionsController < ApplicationController
  def new
  end

  def create
    if user = authenticate_with_google
      cookies.signed[:user_id] = user.id
      redirect_to root_path
    else
      redirect_to new_session_path, alert: 'authentication failed'
    end
  end

  def destroy
    cookies.delete :user_id
    redirect_to new_session_path, notice: 'signed out'
  end

  private

  def authenticate_with_google
    if id_token = flash['google_sign_in']['id_token']
      ident = GoogleSignIn::Identity.new(id_token)
      u = User.where(email: ident.email_address).first_or_initialize
      u.google_id = ident.user_id
      u.first_name = ident.given_name
      u.last_name = ident.family_name
      u.save! if u.changed?
      u
    elsif error = flash['google_sign_in']['error']
      logger.error "Google authentication error: #{error}"
      nil
    end
  end
end