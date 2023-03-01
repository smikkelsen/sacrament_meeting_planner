CreateHymnsJob.perform_now
User.create(first_name: 'D.C.', last_name: 'Davies', email: 'dc@test.com', role: :bishop, conductor: true)
User.create(first_name: 'J.I.', last_name: 'Hardcastle', email: 'ji@test.com', role: :bishopric, conductor: true, prepper: true)
User.create(first_name: 'Sean', last_name: 'Mikkelsen', email: 'sean@mikkelsenfam.com', role: :admin, conductor: true, prepper: true)

User.create(first_name: 'Bruce', last_name: 'Jenkins', email: 'bruce@test.com', role: :clerk)

User.create(first_name: 'Diane', last_name: 'Hunsaker', email: 'diane@test.com', role: :participant, organist: true)
User.create(first_name: 'Sarah', last_name: 'McConkie', email: 'sarah@test.com', role: :music, organist: true)
User.create(first_name: 'Julie', last_name: 'Peterson', email: 'julie@test.com', role: :participant, organist: true)

User.create(first_name: 'Josh', last_name: 'Orr', email: 'josh@test.com', role: :participant, chorister: true)

# Program.generate(start_date: Date.today.beginning_of_year.strftime("%Y-%m-%d"))


