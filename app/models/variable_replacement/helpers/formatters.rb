module VariableReplacement
  module Helpers
    module Formatters
      include ActionView::Helpers::NumberHelper
      STRING_METHODS = %w(humanize capitalize downcase underscore upcase titleize html_safe)

      def day(date)
        return date if date.blank?
        if date.is_a? String
          date = Date.parse(date)
        end
        date.in_time_zone(timezone).strftime("%-d")
      rescue
        ''
      end

      def mm_dd_y(date)
        return date if date.blank?
        if date.is_a? String
          date = Date.parse(date)
        end
        date.in_time_zone(timezone).strftime("%m-d-y")
      rescue
        ''
      end

      def humanized_date(date)
        return date if date.blank?
        if date.is_a? String
          date = Date.parse(date)
        end
        date.in_time_zone(timezone).strftime("%b #{date.day.ordinalize}, %Y")
      rescue
        ''
      end

      def ordinalized_day(date)
        return date if date.blank?
        if date.is_a? String
          date = Date.parse(date)
        end
        date.day.ordinalize
      rescue
        ''
      end

      def month(date)
        return date if date.blank?
        if date.is_a? String
          date = Date.parse(date)
        end
        date.in_time_zone(timezone).strftime("%b")
      rescue
        ''
      end

      def time(time)
        return time if time.blank?
        if time.is_a? String
          time = Time.parse(time)
        end
        time.in_time_zone(timezone).strftime("%l:%M %P")
      rescue
        ''
      end

      def date_time(str)
        return str if str.blank?
        if str.is_a? String
          date = Time.parse(str).in_time_zone(timezone)
          date.strftime("%m/%d/%y %I:%M %p")
        else
          str.in_time_zone(timezone).strftime("%m/%d/%y %I:%M %p")
        end
      rescue
        ''
      end

      STRING_METHODS.each do |method_name|
        define_method(method_name) do |str|
          str.send(method_name)
        end
      end

      private
      def timezone
        AccountSetting.find_by_name('timezone')&.value || 'UTC'
      end
    end
  end
end