module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: [:show, :update]

      def index
        @users = User.accessible_by(current_ability).order(created_at: :asc).paginate(page: params[:page])
      end

      def user_roles
        @roles = User.roles.map{|k, v| {id: v, value: k, label: k.humanize}}
      end

      def show
      end

      def update
        authorize! :update, @user
        if @user.update(user_params)
          render :show
        else
          render json: { error: @user.errors.full_messages }.to_json
        end
      end

      def current
        @user = current_user
        render :show
      end

      private

      def user_params
        params.require(:user).permit(
          :first_name, :last_name, :email, :role, :prepper, :organist, :chorister, :conductor, :prefix, :display_name
        )
      end

      def set_user
        @user = User.find(params[:id])
      end
    end
  end
end

