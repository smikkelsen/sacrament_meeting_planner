module Api
  module V1
    class TemplatesController < ApplicationController
      before_action :set_template, only: [:show, :update]

      def index
        @templates = ::Template.accessible_by(current_ability).all
      end

      def show
        authorize! :read, @template
      end

      def create
        authorize! :create, ::Template
        @template = ::Template.new(template_params)
        if @template.save
          render :show
        else
          render json: { error: @template.errors.full_messages }.to_json
        end
      end

      def update
        authorize! :update, @template
        if @template.update(template_params)
          render :show
        else
          render json: { error: @template.errors.full_messages }.to_json
        end
      end

      def list_vars
        klass = case params[:template_type]
                when 'conducting'
                  VariableReplacement::ConductingTemplateVariables
                when 'program'
                  VariableReplacement::ProgramTemplateVariables
                end
        system_vars = klass.system_vars.map { |a| { group: a[:group], name: a[:display_name], value: "{!#{a[:name]}}" } }
                           .group_by { |h| h[:group] }
        nested_object_vars = klass.nested_objects.map { |a| a[:attributes].map { |b| { group: a[:display_name], name: b.humanize, value: "{!#{a[:obj]}[#{b}]}" } } }.flatten.group_by { |h| h[:group] }
        collection_objects = klass.collection_objects.map { |a| { name: a[:display_name], value: "{!!#{a[:obj]}}<br><br>{!!end}" } }
        collection_vars = klass.collection_objects.map { |a| a[:attributes].map { |b| { group: a[:display_name], name: b.humanize, value: "{!#{b}}" } } }.flatten
                               .group_by { |h| h[:group] }
        other_vars = {
          "Other" => [{ name: "If Present", value: "{!!if_present}<br><br>{!!end_if_present}" }],
          "Formatters" => %w(day mm_dd_y humanized_date time date_time humanize capitalize downcase underscore upcase).map {|f| {name: f, value: f}}
        }
        render json: { system_vars: system_vars, nested_object_vars: nested_object_vars,
                       collection_objects: { "Collection Wrappers" => collection_objects },
                       collection_vars: collection_vars, other_vars: other_vars }.to_json

      end

      private

      def set_template
        @template = ::Template.find(params[:id])
      end

      def template_params
        params.require(:template).permit(
          :name, :body, :template_type, :scripts, :styles, pdf_settings: {}
        )
      end
    end
  end
end

