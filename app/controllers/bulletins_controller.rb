class BulletinsController < ApplicationController

  def public
    @bulletin_items = BulletinItem.where(archived: false).order(position: :asc)
    if params[:item_type]
      @bulletin_items = @bulletin_items.where(item_type: params[:item_type])
      setting = AccountSetting.find_by_name("bulletin_template_#{params[:item_type]}_id")
    end
    setting ||= AccountSetting.find_by_name("bulletin_template_id")
    @template = Template.find(setting.value) if setting
    if @template
      args = { bulletin_items: @bulletin_items }
      if params[:item_type]
        BulletinItem.item_types.keys.each do |type|
          args[:"#{type}_bulletin_items"] = []
          args[:"#{type}_bulletin_items"] = @bulletin_items if params[:item_type] == type
        end
      end
      v = "VariableReplacement::#{@template.template_type.capitalize}TemplateVariables".constantize.new(args)
      @html = v.prep_query_string(@template.body)
      render 'bulletins/generate_template', layout: 'public_plain'
    else
      render 'bulletins/not_available', layout: 'public'
    end
  end

end