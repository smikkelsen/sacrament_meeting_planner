class ProgramsController < ApplicationController
  before_action :set_program, only: [:generate_template]
  load_and_authorize_resource

  def generate_template
    @template = Template.find(params[:template_id])
    respond_to do |format|
      format.html do
        render 'programs/generate_template', layout: false
      end
      format.pdf do
        render pdf: "#{@template.name} - #{@program.date.strftime('%Y-%m-%d')}",
               layout: false,
               template: "programs/generate_template",
               formats: [:html],
               page_size: 'A4',
               disposition: :inline
      end
    end
  end

  def set_program
    @program = Program.find(params[:id])
  end
end