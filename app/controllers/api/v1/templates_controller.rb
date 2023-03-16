module Api
  module V1
    class TemplatesController < ApplicationController
      before_action :set_template, only: [:show, :update]
      load_and_authorize_resource

      def index
        @templates = Template.all
      end

      def show
      end

      def create
        @template =Template.new(template_params)
        if @template.save
          render :show
        else
          render json: {error: @template.errors.full_messages}.to_json
        end
      end

      def update
        if @template.update(template_params)
          render :show
        else
          render json: {error: @template.errors.full_messages}.to_json
        end
      end

      private

      def set_template
        @template = Template.find(params[:id])
      end

      def template_params
        params.require(:template).permit(
          :name, :body, :template_type
        )
      end
    end
  end
end

