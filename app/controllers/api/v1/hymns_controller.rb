module Api
  module V1
    class HymnsController < ApplicationController
      before_action :set_hymn, only: [:show]

      def index
        @hymns = Hymn.accessible_by(current_ability).order(:category, :page).all
      end

      def show
        authorize! :show, Hymn
      end

      private

      def set_hymn
        @hymn = Hymn.find(params[:id])
      end
    end
  end
end

