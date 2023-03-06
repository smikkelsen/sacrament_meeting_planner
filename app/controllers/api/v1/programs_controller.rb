module Api
  module V1
    class ProgramsController < ApplicationController
      before_action :set_program, only: [:show, :update]
      load_and_authorize_resource

      def index
        @programs = Program.includes(:program_items).order(date: :asc)

        if params[:search_value]
          if params[:search_type]
            @programs = @programs.where(program_items: { item_type: params[:search_type] })
                                 .where("key ilike :val OR value ilike :val", val: "%#{params[:search_value]}%")
          else

          end
        end
        @programs.paginate(page: params[:page])
      end

      def show
      end

      def update
        @program.update!(program_params)
        render :show
      end

      private

      def program_params
        params.require(:program)
              .permit(:meeting_type, :date, :presiding_id, :conducting_id, :prep_id, :chorister_id,
                      :organist_id, :opening_hymn_id, :intermediate_hymn_id, :sacrament_hymn_id, :closing_hymn_id,
                      :opening_prayer, :closing_prayer, :notes,
                      program_items_attributes: [:id, :key, :value, :item_type, :program_id, :_destroy])
      end

      def set_program
        @program = Program.find(params[:id])
      end
    end
  end
end

