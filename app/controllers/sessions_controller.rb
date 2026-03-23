class SessionsController < ApplicationController
  def new
  end

  def create
    if user = authenticate_with_google
      # Set cookie to expire in 30 days
      cookies.signed[:user_id] = {
        value: user.id,
        expires: 30.days.from_now,
        httponly: true
      }
      redirect_to root_path, notice: 'Successfully signed in'
    else
      redirect_to new_session_path, alert: 'Authentication failed. Please try again.'
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