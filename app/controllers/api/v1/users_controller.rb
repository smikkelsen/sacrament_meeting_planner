module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: [:show]

      def index
        @users = User.accessible_by(current_ability).paginate(page: params[:page])
      end

      def show
      end

      def current
        @user = current_user
        render :show
      end

      private

      def set_user
        @user = User.find(params[:id])
      end
    end
  end
end

