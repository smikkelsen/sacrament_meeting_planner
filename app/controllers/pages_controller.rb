class PagesController < ApplicationController

  before_action :authenticate_user!

  def dashboard
  end

  def hymns
  end

  def templates
  end

  def programs
  end

  def reports
  end
end
