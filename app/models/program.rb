class Program < ApplicationRecord

  enum meeting_type: { standard: 0, fast_sunday: 1, ward_conference: 2, stake_conference: 3, general_conference: 4 }

  has_many :program_items, -> { order(:position) }, dependent: :destroy
  accepts_nested_attributes_for :program_items, allow_destroy: true, reject_if: proc { |attributes| attributes['key'].blank? }

  belongs_to :conducting, class_name: 'User', optional: true
  belongs_to :prep, class_name: 'User', optional: true
  belongs_to :presiding, class_name: 'User', optional: true
  belongs_to :chorister, class_name: 'User', optional: true
  belongs_to :organist, class_name: 'User', optional: true

  belongs_to :opening_hymn, class_name: 'Hymn', optional: true
  belongs_to :closing_hymn, class_name: 'Hymn', optional: true
  belongs_to :intermediate_hymn, class_name: 'Hymn', optional: true
  belongs_to :sacrament_hymn, class_name: 'Hymn', optional: true

  scope :next, -> { where('date >= ?', Date.today).order(date: :asc).limit(1).first }
  validates_presence_of :date, :meeting_type
  # validates_presence_of :presiding_id, :conducting_id, :chorister_id, :organist_id, if: -> {meeting_type.in? :standard, :fast_sunday, :ward_conference}

  def next_program?
    self.date.today? || self.date == Date.today.next_occurring(:sunday)
  end

  def self.generate(end_date: nil, start_date: nil, prepper: nil, conducting: nil, organist: nil, chorister: nil, presiding: nil)
    end_date = end_date.nil? ? Date.current.end_of_year : Date.parse(end_date)
    last_date = start_date ? Date.parse(start_date) : Program.order(date: :desc).first&.date
    last_date ||= Date.current
    next_date = last_date.sunday? ? last_date : last_date.next_occurring(:sunday)

    while next_date <= end_date do
      unless Program.where(date: next_date).exists?
        meeting_type = (next_date.day < 8) ? :fast_sunday : :standard
        Program.create!(
          date: next_date,
          meeting_type: meeting_type,
          presiding_id: presiding,
          conducting_id: conducting,
          prep_id: prepper,
          organist_id: organist,
          chorister_id: chorister,
        )
      end
      next_date = next_date.next_occurring(:sunday)
    end
  end

  def template_replacement(template_id)
    template = Template.find(template_id)
    v = VariableReplacement::ConductingTemplateVariables.new(program: self)
    v.prep_query_string(template.body)
  end
end
