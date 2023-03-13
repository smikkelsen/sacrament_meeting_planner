# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_03_11_055121) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "hymns", force: :cascade do |t|
    t.string "name"
    t.integer "page"
    t.integer "category"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "program_items", force: :cascade do |t|
    t.string "key"
    t.string "value"
    t.integer "item_type"
    t.integer "program_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "programs", force: :cascade do |t|
    t.integer "meeting_type", null: false
    t.date "date", null: false
    t.integer "presiding_id"
    t.integer "conducting_id"
    t.integer "prep_id"
    t.integer "chorister_id"
    t.integer "organist_id"
    t.integer "opening_hymn_id"
    t.integer "intermediate_hymn_id"
    t.integer "sacrament_hymn_id"
    t.integer "closing_hymn_id"
    t.string "opening_prayer"
    t.string "closing_prayer"
    t.text "notes"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "templates", force: :cascade do |t|
    t.integer "template_type"
    t.string "name"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "google_id"
    t.integer "role", default: 0
    t.boolean "prepper", default: false
    t.boolean "organist", default: false
    t.boolean "chorister", default: false
    t.boolean "conductor", default: false
    t.string "workflow_state", default: "active"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["google_id"], name: "index_users_on_google_id", unique: true
  end

end
