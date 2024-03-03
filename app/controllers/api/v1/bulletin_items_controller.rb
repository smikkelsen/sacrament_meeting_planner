module Api
  module V1
    class BulletinItemsController < ApplicationController
      before_action :set_bulletin_item, only: [:show, :update, :destroy]

      def item_types
        render json: { item_types: BulletinItem.item_types.map {|k,v| {key: k, value: v, label: k.humanize}} }.to_json
      end

      def index
        @bulletin_items = BulletinItem.accessible_by(current_ability).order(position: :asc)
      end

      def show
      end

      def update
        authorize! :update, @bulletin_item
        if @bulletin_item.update(bulletin_item_params)
          render :show
        else
          render json: { error: @bulletin_item.errors.full_messages }.to_json
        end
      end

      def update_positions
        authorize! :update, BulletinItem
        params[:bulletin_items].each do |bi|
          BulletinItem.where(id: bi[:id]).update_all(position: bi[:position])
        end
        render json: { status: :ok }.to_json
      end

      def create
        authorize! :create, ::BulletinItem
        @bulletin_item = ::BulletinItem.new(bulletin_item_params)
        if @bulletin_item.save
          render :show
        else
          render json: { error: @bulletin_item.errors.full_messages }.to_json
        end
      end

      def destroy
        authorize! :destroy, @bulletin_item
        if @bulletin_item.destroy
          render json: { status: :ok }.to_json
        else
          render json: { error: @bulletin_item.errors.full_messages }.to_json
        end
      end

      private

      def bulletin_item_params
        params.require(:bulletin_item).permit(
          :message, :position, :archived, :date, :time, :item_type, :_destroy
        )
      end

      def set_bulletin_item
        @bulletin_item = BulletinItem.find(params[:id])
      end
    end
  end
end

