module Api
  module V1
    class TemplatesController < ApplicationController
      before_action :set_template, only: [:show, :update]

      def index
        @templates = ::Template.accessible_by(current_ability).all
      end

      def show
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
                  VariableReplacement::ConductingTemplateVariables
                end
        system_vars = klass.system_vars.map { |a| { group: a[:group], name: a[:display_name], value: "{!#{a[:name]}}" } }
                           .group_by { |h| h[:group] }
        nested_object_vars = klass.nested_objects.map { |a| a[:attributes].map { |b| { group: a[:obj], name: b.humanize, value: "{!#{a[:obj]}[#{b}]}" } } }.flatten.group_by { |h| h[:group] }
        collection_objects = klass.collection_objects.map { |a| { group: a[:obj], name: a[:display_name], value: "{!!#{a[:obj]}}\n{!!end}" } }
                                  .group_by { |h| h[:group] }
        collection_variables = klass.collection_objects.map { |a| a[:attributes].map { |b| { group: a[:obj], name: b.humanize, value: "{!#{b}}" } } }.flatten
                                    .group_by { |h| h[:group] }
        render json: {system_vars: system_vars, nested_object_vars: nested_object_vars, collection_objects: collection_objects, collection_variables: collection_variables}.to_json

      end

      private

      def set_template
        @template = ::Template.find(params[:id])
      end

      def template_params
        params.require(:template).permit(
          :name, :body, :template_type, pdf_settings: {}
        )
      end
    end
  end
end

