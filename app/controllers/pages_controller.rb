class PagesController < ApplicationController

  before_action :authenticate_user!, only: [:dashboard, :hymns, :programs]

  def dashboard
  end

  def hymns
  end

  def programs
  end
end
