module Api
  module V1
    class HymnsController < ApplicationController
      before_action :set_hymn, only: [:show]
      load_and_authorize_resource

      def index
        @hymns = Hymn.all
      end

      def show
      end

      private

      def set_hymn
        @task = Hymn.find(params[:id])
      end
    end
  end
end

