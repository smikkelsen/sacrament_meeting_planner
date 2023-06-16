module Api
  module V1
    class ProgramsController < ApplicationController
      before_action :set_program, only: [:show, :update, :generate_template]

      def index
        @programs = Program.accessible_by(current_ability).includes(:program_items)
                           .eager_load(:presiding, :conducting, :prep, :chorister, :organist, :opening_hymn,
                                       :sacrament_hymn, :intermediate_hymn, :closing_hymn)
                           .order(date: params[:date_order] || :asc)
                           .order(ProgramItem.arel_table[:created_at].asc)

        if params[:search_value]
          case params[:search_type]
          when 'prayer'
            @programs = @programs.where("opening_prayer ilike :val OR closing_prayer ilike :val", val: "%#{params[:search_value]}%")
          when 'notes'
            @programs = @programs.where("notes ilike :val", val: "%#{params[:search_value]}%")
          when 'hymns'
            @programs = @programs.where(opening_hymn_id: search_hymns)
                                 .or(Program.where(intermediate_hymn_id: search_hymns))
                                 .or(Program.where(sacrament_hymn_id: search_hymns))
                                 .or(Program.where(closing_hymn_id: search_hymns))
          when 'all'
            @programs = @programs.where("key ilike :val OR value ilike :val", val: "%#{params[:search_value]}%")
                                 .or(Program.where("notes ilike :val", val: "%#{params[:search_value]}%"))
                                 .or(Program.where("opening_prayer ilike :val OR closing_prayer ilike :val", val: "%#{params[:search_value]}%"))
                                 .or(Program.where(opening_hymn_id: search_hymns))
                                 .or(Program.where(intermediate_hymn_id: search_hymns))
                                 .or(Program.where(sacrament_hymn_id: search_hymns))
                                 .or(Program.where(closing_hymn_id: search_hymns))
          else
            @programs = @programs.where(program_items: { item_type: params[:search_type] })
                                 .where("key ilike :val OR value ilike :val", val: "%#{params[:search_value]}%")
          end

        end
        if params[:start_date].blank? && params[:end_date].blank?
          @programs = @programs.where('date > ?', 3.weeks.ago)

        else
          @programs = @programs.where('date < ?', params[:end_date]) if params[:end_date].present?
          @programs = @programs.where('date > ?', params[:start_date]) if params[:start_date].present?
        end
        per_page = (params[:per_page] || 10).to_i
        @programs = @programs.limit(per_page).distinct
      end

      def show
        authorize! :show, @program
      end

      def generate_template
        authorize! :show, @program
        authorize! :show, @template
        @template = ::Template.find(params[:template_id])
        render json: { body: @program.template_replacement(@template.id).html_safe }.to_json
      end

      def update
        authorize! :update, @program
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

      def search_hymns
        Hymn.where("name ilike :val", val: "%#{params[:search_value]}%")
            .or(Hymn.where(page: params[:search_value]))
            .pluck(:id)
      end
    end
  end
end

