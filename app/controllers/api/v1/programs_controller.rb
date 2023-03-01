module Api
  module V1
    class ProgramsController < ApplicationController
      before_action :set_program, only: [:show]
      load_and_authorize_resource

      def index
        @programs = Program.paginate(page: params[:page])
      end

      def show
      end

      private

      def set_program
        @program = Program.find(params[:id])
      end
    end
  end
end

