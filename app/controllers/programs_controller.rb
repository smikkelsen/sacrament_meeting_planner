class ProgramsController < ApplicationController
  before_action :set_program, only: [:generate_template]
  load_and_authorize_resource except: [:public]

  def generate_template
    @template = Template.find(params[:template_id])
    respond_to do |format|
      format.html do
        render 'programs/generate_template', layout: false
      end
      format.docx do
        render docx: "programs/generate_template", filename: 'my_file.docx'
      end
      format.pdf do
        render pdf: "#{@template.name} - #{@program.date.strftime('%Y-%m-%d')}",
               layout: false,
               template: "programs/generate_template",
               formats: [:html],
               disposition: :inline,
               page_size: @template.pdf_settings[:page_size] || 'Letter',
               orientation: @template.pdf_settings[:orientation] || 'Portrait',
               margin: { top: @template.pdf_settings[:margin_top] || 0.5,
                         bottom: @template.pdf_settings[:margin_bottom] || 0.5,
                         left: @template.pdf_settings[:margin_left] || 0.5,
                         right: @template.pdf_settings[:margin_right] || 0.5 }
      end
    end
  end

  def public
    @program = Program.next
    setting = AccountSetting.find_by_name('public_template_id')
    @template = Template.find(setting.value) if setting
    if @program&.published && @template
      render 'programs/generate_template', layout: false
    else
      render 'programs/not_available', layout: 'public'
    end
  end

  def set_program
    @program = Program.find(params[:id])
  end
end