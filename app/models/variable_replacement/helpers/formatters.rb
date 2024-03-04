module VariableReplacement
  module Helpers
    module Formatters
      include ActionView::Helpers::NumberHelper
      STRING_METHODS = %w(humanize capitalize downcase underscore upcase titleize)

      def day(date)
        if time.is_a? String
          date = Date.parse(date).in_time_zone(timezone)
        end
        date.in_time_zone(timezone).strftime("%D")
      rescue
        ''
      end

      def mm_dd_y(date)
        if date.is_a? String
          date = Date.parse(date).in_time_zone(timezone)
        end
        date.in_time_zone(timezone).strftime("%m-d-y")
      rescue
        ''
      end

      def humanized_date(date)
        if date.is_a? String
          date = Date.parse(date).in_time_zone(timezone)
        end
        date.in_time_zone(timezone).strftime("%b #{date.day.ordinalize}, %Y")
      end

      def time(time)
        if time.is_a? String
          time = Time.parse(time).in_time_zone(timezone)
        end
        time.in_time_zone(timezone).strftime("%I:%M %p")
      rescue
        ''
      end

      def date_time(str)
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
        AccountSetting.find_by_name('timezone') || 'UTC'
      end
    end
  end
end