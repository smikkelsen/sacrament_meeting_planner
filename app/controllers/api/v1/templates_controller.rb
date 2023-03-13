module Api
  module V1
    class TemplatesController < ApplicationController
      before_action :set_template, only: [:show]
      load_and_authorize_resource

      def index
        @templates = Template.all
      end

      def show
      end

      private

      def set_hymn
        @template = Template.find(params[:id])
      end
    end
  end
end

