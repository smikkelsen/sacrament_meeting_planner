module Api
  module V1
    class HymnsController < ApplicationController
      before_action :set_hymn, only: [:show, :update, :destroy]

      def index
        @hymns = Hymn.accessible_by(current_ability).order(:category, :page).all
      end

      def show
        authorize! :show, Hymn
      end

      def create
        authorize! :create, Hymn
        @hymn = Hymn.new(hymn_params)

        if @hymn.save
          render :show, status: :created
        else
          render json: { errors: @hymn.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        authorize! :update, @hymn

        if @hymn.update(hymn_params)
          render :show
        else
          render json: { errors: @hymn.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize! :destroy, @hymn
        @hymn.destroy
        head :no_content
      end

      private

      def set_hymn
        @hymn = Hymn.find(params[:id])
      end

      def hymn_params
        params.require(:hymn).permit(:name, :page, :category)
      end
    end
  end
end

