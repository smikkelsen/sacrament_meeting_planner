class CreateAnnualProgramsJob < ApplicationJob

  def perform(year=Date.current.to_s)

    start_of_year = Date.parse(year).beginning_of_year
    end_of_year = start_of_year.end_of_year

    bishop = User.active.where(role: :bishop).first
    preppers = User.active.where(prepper: true).shuffle.map {|u| [u.id, 0]}.to_h
    conductors = User.active.where(conductor: true).shuffle.map {|u| [u.id, 0]}.to_h
    organists = User.active.where(organist: true).shuffle.map {|u| [u.id, 0]}.to_h
    choristers = User.active.where(chorister: true).shuffle.map {|u| [u.id, 0]}.to_h

    month_start = start_of_year
    while month_start < end_of_year
      month_end = month_start.end_of_month
      prep = get_next(preppers)
      preppers[prep] += 1
      conduct = get_next(conductors, prep)
      conductors[conduct] += 1
      organist = get_next(organists)
      organists[organist] += 1
      chorister = get_next(choristers)
      choristers[chorister] += 1
      Program.generate(start_date: month_start.iso8601, end_date: month_end.iso8601, prepper: prep, conducting: conduct, organist: organist, chorister: chorister, presiding: bishop.id)
      month_start = month_end + 1.day
    end
  end

  def get_next(resources, blacklist=nil)
    resources.except(blacklist).sort_by {|_k, v| v}.first[0]
  end
end