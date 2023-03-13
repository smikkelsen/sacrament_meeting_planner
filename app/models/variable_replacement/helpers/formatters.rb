module VariableReplacement
  module Helpers
    module Formatters
      include ActionView::Helpers::NumberHelper

      def format_date_as_day(time)
        if time.is_a? String
          time = Time.parse(time)
        end
        time.strftime("%D")
      rescue
        ''
      end

      def format_date_as_time(time)
        if time.is_a? String
          time = Time.parse(time)
        end
        time.strftime("%I:%M %p")
      rescue
        ''
      end

      def format_date_as_day_and_time(str)
        if str.is_a? String
          date = Time.parse(str)
          date.strftime("%m/%d/%y %I:%M %p")
        else
          str.strftime("%m/%d/%y %I:%M %p")
        end
      rescue
        ''
      end

      def format_as_money_from_cents(int)
        int = int.to_f / 100.0 rescue 0
        number_to_currency(int)
      end


      def format_as_money(int)
        int = int.to_f rescue 0
        number_to_currency(int)
      end

      def format_as_percent(int)
        number_to_percentage(int, strip_insignificant_zeros: true)
      end

    end
  end
end