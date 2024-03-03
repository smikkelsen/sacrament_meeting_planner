class PagesController < ApplicationController

  before_action :authenticate_user!

  def dashboard
  end

  def users
  end

  def bulletin
  end

  def hymns
  end

  def templates
  end

  def programs
  end

  def bulk_edit
  end

  def reports
  end
end
