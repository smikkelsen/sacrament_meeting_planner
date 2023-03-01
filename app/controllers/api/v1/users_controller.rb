module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: [:show]
      load_and_authorize_resource

      def index
        @users = User.paginate(page: params[:page])
      end

      def show
      end

      private

      def set_user
        @users = User.find(params[:id])
      end
    end
  end
end

