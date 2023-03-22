# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    # { pending: 0, participant: 1, music: 10, clerk: 19, bishopric: 20, bishop: 21, admin: 99 }

    user ||= User.new # guest user (not logged in)
    case user.role
    when 'pending'
    when 'participant'
    when 'music'
      can [:read, :update, :edit], Program
      can [:read, :update, :edit], Hymn
    when 'clerk'
      can [:read, :update, :edit], Program
      can [:read, :update, :edit], Template
      can [:read, :update, :edit], Hymn
    when 'bishopric'
      can [:read, :update, :edit], Program
      can [:read, :update, :edit], ::Template
      can :manage, Template
      can [:read, :update, :edit], Hymn
    when 'bishop'
      can [:read, :update, :edit], Program
      can [:read, :update, :edit], Template
      can [:read, :update, :edit], Hymn
    when 'admin'
      can :manage, :all
    end
  end
end
