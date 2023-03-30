module Api
  module V1
    class TrelloController < ApplicationController
      before_action :set_hymn, only: [:show]

      def board_lists
        authorize! :board_lists, Trello
        board_id = AccountSetting.find_by_name('trello_board_id')&.value || ''
        lists = Trello::Board.find(board_id)&.lists
        render json: { lists: lists }.to_json
      end

      def list_cards
        authorize! :list_cards, Trello
        list_name = "#{params[:list_type]}_list_id" # release or sustain
        list_id = AccountSetting.find_by_name(list_name)&.value || ''
        cards = Trello::List.find(list_id)&.cards
        render json: { cards: cards }.to_json
      end

    end
  end
end

