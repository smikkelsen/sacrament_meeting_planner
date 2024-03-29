module Api
  module V1
    class ProgramsController < ApplicationController
      before_action :set_program, only: [:show, :update, :generate_template]

      def index
        @programs = Program.accessible_by(current_ability).includes(:program_items)
                           .eager_load(:presiding, :conducting, :prep, :chorister, :organist, :opening_hymn,
                                       :sacrament_hymn, :intermediate_hymn, :closing_hymn)
                           .order(date: params[:date_order] || :asc)
                           .order(ProgramItem.arel_table[:position].asc)

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
        @programs = @programs.where('date <= ?', params[:end_date]) if params[:end_date].present?
        @programs = @programs.where('date >= ?', params[:start_date]) if params[:start_date].present?
        per_page = (params[:per_page] || 30).to_i
        @programs = @programs.limit(per_page).distinct
      end

      def show
        authorize! :show, @program
      end

      def generate_template
        authorize! :generate_template, Program
        @template = ::Template.find(params[:template_id])
        render json: { body: @program.template_replacement(@template.id).html_safe }.to_json
      end

      def update
        authorize! :update, @program
        @program.update!(program_params)
        render :show
      end

      def bulk_edit
        authorize! :update, Program
        end_date = params[:end_date]
        start_date = params[:start_date]
        raise 'Start and End dates are required' unless start_date && end_date
        program_template = Program.new(bulk_edit_params)
        programs = Program.where('date >= ? and date <= ?', start_date, end_date)
        update_attributes = program_template.attributes.select {|k,v| v.present?}
        programs.update_all(update_attributes)
        render json: { status: 200, message: "Updated #{programs.count} programs" }.to_json, status: 200
      rescue => e
        render json: { status: 400, message: e.message }.to_json, status: 400
      end

      private

      def program_params
        params.require(:program)
              .permit(:meeting_type, :date, :presiding_id, :conducting_id, :prep_id, :chorister_id,
                      :organist_id, :opening_hymn_id, :intermediate_hymn_id, :sacrament_hymn_id, :closing_hymn_id,
                      :opening_prayer, :closing_prayer, :notes, :published,
                      program_items_attributes: [:id, :key, :value, :item_type, :program_id, :position, :_destroy])
      end

      def bulk_edit_params
        params.require(:program)
              .permit(:presiding_id, :conducting_id, :prep_id, :chorister_id, :organist_id)
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

