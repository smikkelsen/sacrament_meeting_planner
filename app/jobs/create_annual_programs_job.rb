class CreateAnnualProgramsJob < ApplicationJob

  def perform(year=Date.current.year)

    start_of_year = Date.new(year.to_i).beginning_of_year
    end_of_year = start_of_year.end_of_year

    # Validate required users exist
    bishop = User.active.where(role: :bishop).first
    raise "No active bishop found. Please assign a user the 'bishop' role." unless bishop

    preppers = User.active.where(prepper: true).shuffle.map {|u| [u.id, 0]}.to_h
    raise "No users with prepper flag found. Please set prepper=true on at least one user." if preppers.empty?

    conductors = User.active.where(conductor: true).shuffle.map {|u| [u.id, 0]}.to_h
    raise "No users with conductor flag found. Please set conductor=true on at least one user." if conductors.empty?

    organists = User.active.where(organist: true).shuffle.map {|u| [u.id, 0]}.to_h
    raise "No users with organist flag found. Please set organist=true on at least one user." if organists.empty?

    choristers = User.active.where(chorister: true).shuffle.map {|u| [u.id, 0]}.to_h
    raise "No users with chorister flag found. Please set chorister=true on at least one user." if choristers.empty?

    month_start = start_of_year
    while month_start <= end_of_year
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