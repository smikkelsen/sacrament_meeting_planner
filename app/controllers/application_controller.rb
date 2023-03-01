class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
      format.html { redirect_to root_path, flash: { alert: exception.message } }
      format.js { head :forbidden, content_type: 'text/html' }
    end
  end

  def authenticate_user!
    redirect_to new_session_path, flash: { alert: 'You must be signed in' } unless current_user.present?
  end

  def current_user
    User.where(id: cookies.signed[:user_id]).first
  end

  helper_method :current_user
end
