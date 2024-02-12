module VariableReplacement
  module Helpers
    module Objects

      DELEGATE_HYMNS = %w[opening_hymn intermediate_hymn sacrament_hymn closing_hymn]
      DELEGATE_USERS = %w[presiding conducting prep chorister organist]
      DELEGATE_ITEM_TYPES = %w[speakers musical_numbers program_others releases sustainings announcements business]

      def program
        return @program if @program
        @program = @args[:program]
        @program ||= Program.new
        @program
      end

      DELEGATE_HYMNS.each do |hymn|
        define_method(hymn) do
          meta_hymn(hymn)
        end
      end

      DELEGATE_USERS.each do |user|
        define_method(user) do
          meta_user(user)
        end
      end

      DELEGATE_ITEM_TYPES.each do |item_type|
        define_method(item_type) do
          meta_program_items(item_type)
        end
      end

      def meta_hymn(hymn_type)
        meta_object(Hymn, hymn_type)
      end

      def meta_user(user_type)
        meta_object(User, user_type)
      end

      def meta_object(obj_klass, obj_type)
        obj = instance_variable_get("@#{obj_type}")
        return obj if obj
        val = @args[obj_type.to_sym]
        val ||= program&.send(obj_type)
        val ||= obj_klass.new
        instance_variable_set("@#{obj_type}", val)
        val
      end

      def transform_program_items(program_items)
        program_items.each do |pi|
          if pi.item_type == 'intermediate_hymn'
            hymn = program.intermediate_hymn
            pi.key = hymn ? "##{hymn&.page} - #{hymn.name}" : 'Not Set'
          end
        end
        program_items
      end

      def all_program_items
        return @all_program_items if @all_program_items
        @all_program_items = @args[:all_program_items]
        @all_program_items ||= program.program_items.order(:created_at).to_a rescue nil
        @all_program_items ||= []
        @all_program_items = transform_program_items(@all_program_items)
        @all_program_items
      end

      def program_items
        return @program_items if @program_items
        @program_items = @args[:program_items]
        @program_items ||= program.program_items.where(item_type: %w(speaker intermediate_hymn musical_number program_other)).order(:created_at).to_a rescue nil
        @program_items ||= []
        @program_items = transform_program_items(@program_items)
        @program_items
      end

      def meta_program_items(item_type)
        items = instance_variable_get("@#{item_type}")
        return items if items
        items = @args[item_type.to_sym]
        items ||= program&.program_items.where(item_type: item_type.singularize).to_a rescue nil
        items ||= []
        items = transform_program_items(items)
        instance_variable_set("@#{item_type}", items)
        items
      end

    end
  end
end