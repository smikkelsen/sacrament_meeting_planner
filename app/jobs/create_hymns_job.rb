class CreateHymnsJob < ApplicationJob

  def perform
    hymns.each do |hymn|
      h=Hymn.where(category: 1, name: hymn[0]).first_or_initialize
      h.page = hymn[1]
      h.save!
    end
  end

  def hymns
    [
      ['The Morning Breaks', 1],
      ['The Spirit of God', 2],
      ['Now Let Us Rejoice', 3],
      ['Truth Eternal', 4],
      ['High on the Mountain Top', 5],
      ['Redeemer of Israel', 6],
      ['Israel, Israel, God Is Calling', 7],
      ['Awake and Arise', 8],
      ['Come, Rejoice', 9],
      ['Come, Sing to the Lord', 10],
      ['What Was Witnessed in the Heavens?', 11],
      ['’Twas Witnessed in the Morning Sky', 12],
      ['An Angel from on High', 13],
      ['Sweet Is the Peace the Gospel Brings', 14],
      ['I Saw a Mighty Angel Fly', 15],
      ['What Glorious Scenes Mine Eyes Behold', 16],
      ['Awake, Ye Saints of God, Awake!', 17],
      ['The Voice of God Again Is Heard', 18],
      ['We Thank Thee, O God, for a Prophet', 19],
      ['God of Power, God of Right', 20],
      ['Come, Listen to a Prophet’s Voice', 21],
      ['We Listen to a Prophet’s Voice', 22],
      ['We Ever Pray for Thee', 23],
      ['God Bless Our Prophet Dear', 24],
      ['Now We’ll Sing with One Accord', 25],
      ['Joseph Smith’s First Prayer', 26],
      ['Praise to the Man', 27],
      ['Saints, Behold How Great Jehovah', 28],
      ['A Poor Wayfaring Man of Grief', 29],
      ['Come, Come, Ye Saints', 30],
      ['O God, Our Help in Ages Past', 31],
      ['The Happy Day at Last Has Come', 32],
      ['Our Mountain Home So Dear', 33],
      ['O Ye Mountains High', 34],
      ['For the Strength of the Hills', 35],
      ['They, the Builders of the Nation', 36],
      ['The Wintry Day, Descending to Its Close', 37],
      ['Come, All Ye Saints of Zion', 38],
      ['O Saints of Zion', 39],
      ['Arise, O Glorious Zion', 40],
      ['Let Zion in Her Beauty Rise', 41],
      ['Hail to the Brightness of Zion’s Glad Morning!', 42],
      ['Zion Stands with Hills Surrounded', 43],
      ['Beautiful Zion, Built Above', 44],
      ['Lead Me into Life Eternal', 45],
      ['Glorious Things of Thee Are Spoken', 46],
      ['We Will Sing of Zion', 47],
      ['Glorious Things Are Sung of Zion', 48],
      ['Adam-ondi-Ahman', 49],
      ['Come, Thou Glorious Day of Promise', 50],
      ['Sons of Michael, He Approaches', 51],
      ['The Day Dawn Is Breaking', 52],
      ['Let Earth’s Inhabitants Rejoice', 53],
      ['Behold, the Mountain of the Lord', 54],
      ['Lo, the Mighty God Appearing!', 55],
      ['Softly Beams the Sacred Dawning', 56],
      ['We’re Not Ashamed to Own Our Lord', 57],
      ['Come, Ye Children of the Lord', 58],
      ['Come, O Thou King of Kings', 59],
      ['Battle Hymn of the Republic', 60],
      ['Raise Your Voices to the Lord', 61],
      ['All Creatures of Our God and King', 62],
      ['Great King of Heaven', 63],
      ['On This Day of Joy and Gladness', 64],
      ['Come, All Ye Saints Who Dwell on Earth', 65],
      ['Rejoice, the Lord Is King!', 66],
      ['Glory to God on High', 67],
      ['A Mighty Fortress Is Our God', 68],
      ['All Glory, Laud, and Honor', 69],
      ['Sing Praise to Him', 70],
      ['With Songs of Praise', 71],
      ['Praise to the Lord, the Almighty', 72],
      ['Praise the Lord with Heart and Voice', 73],
      ['Praise Ye the Lord', 74],
      ['In Hymns of Praise', 75],
      ['God of Our Fathers, We Come unto Thee', 76],
      ['Great Is the Lord', 77],
      ['God of Our Fathers, Whose Almighty Hand', 78],
      ['With All the Power of Heart and Tongue', 79],
      ['God of Our Fathers, Known of Old', 80],
      ['Press Forward, Saints', 81],
      ['For All the Saints', 82],
      ['Guide Us, O Thou Great Jehovah', 83],
      ['Faith of Our Fathers', 84],
      ['How Firm a Foundation', 85],
      ['How Great Thou Art', 86],
      ['God Is Love', 87],
      ['Great God, Attend While Zion Sings', 88],
      ['The Lord Is My Light', 89],
      ['From All That Dwell below the Skies', 90],
      ['Father, Thy Children to Thee Now Raise', 91],
      ['For the Beauty of the Earth', 92],
      ['Prayer of Thanksgiving', 93],
      ['Come, Ye Thankful People', 94],
      ['Now Thank We All Our God', 95],
      ['Dearest Children, God Is Near You', 96],
      ['Lead, Kindly Light', 97],
      ['I Need Thee Every Hour', 98],
      ['Nearer, Dear Savior, to Thee', 99],
      ['Nearer, My God, to Thee', 100],
      ['Guide Me to Thee', 101],
      ['Jesus, Lover of My Soul', 102],
      ['Precious Savior, Dear Redeemer', 103],
      ['Jesus, Savior, Pilot Me', 104],
      ['Master, the Tempest Is Raging', 105],
      ['God Speed the Right', 106],
      ['Lord, Accept Our True Devotion', 107],
      ['The Lord Is My Shepherd', 108],
      ['The Lord My Pasture Will Prepare', 109],
      ['Cast Thy Burden upon the Lord', 110],
      ['Rock of Ages', 111],
      ['Savior, Redeemer of My Soul', 112],
      ['Our Savior’s Love', 113],
      ['Come unto Him', 114],
      ['Come, Ye Disconsolate', 115],
      ['Come, Follow Me', 116],
      ['Come unto Jesus', 117],
      ['Ye Simple Souls Who Stray', 118],
      ['Come, We That Love the Lord', 119],
      ['Lean on My Ample Arm', 120],
      ['I’m a Pilgrim, I’m a Stranger', 121],
      ['Though Deepening Trials', 122],
      ['Oh, May My Soul Commune with Thee', 123],
      ['Be Still, My Soul', 124],
      ['How Gentle God’s Commands', 125],
      ['How Long, O Lord Most Holy and True', 126],
      ['Does the Journey Seem Long?', 127],
      ['When Faith Endures', 128],
      ['Where Can I Turn for Peace?', 129],
      ['Be Thou Humble', 130],
      ['More Holiness Give Me', 131],
      ['God Is in His Holy Temple', 132],
      ['Father in Heaven', 133],
      ['I Believe in Christ', 134],
      ['My Redeemer Lives', 135],
      ['I Know That My Redeemer Lives', 136],
      ['Testimony', 137],
      ['Bless Our Fast, We Pray', 138],
      ['In Fasting We Approach Thee', 139],
      ['Did You Think to Pray?', 140],
      ['Jesus, the Very Thought of Thee', 141],
      ['Sweet Hour of Prayer', 142],
      ['Let the Holy Spirit Guide', 143],
      ['Secret Prayer', 144],
      ['Prayer Is the Soul’s Sincere Desire', 145],
      ['Gently Raise the Sacred Strain', 146],
      ['Sweet Is the Work', 147],
      ['Sabbath Day', 148],
      ['As the Dew from Heaven Distilling', 149],
      ['O Thou Kind and Gracious Father', 150],
      ['We Meet, Dear Lord', 151],
      ['God Be with You Till We Meet Again', 152],
      ['Lord, We Ask Thee Ere We Part', 153],
      ['Father, This Hour Has Been One of Joy', 154],
      ['We Have Partaken of Thy Love', 155],
      ['Sing We Now at Parting', 156],
      ['Thy Spirit, Lord, Has Stirred Our Souls', 157],
      ['Before Thee, Lord, I Bow My Head', 158],
      ['Now the Day Is Over', 159],
      ['Softly Now the Light of Day', 160],
      ['The Lord Be with Us', 161],
      ['Lord, We Come before Thee Now', 162],
      ['Lord, Dismiss Us with Thy Blessing', 163],
      ['Great God, to Thee My Evening Song', 164],
      ['Abide with Me; ’Tis Eventide', 165],
      ['Abide with Me!', 166],
      ['Come, Let Us Sing an Evening Hymn', 167],
      ['As the Shadows Fall', 168],
      ['As Now We Take the Sacrament', 169],
      ['God, Our Father, Hear Us Pray', 170],
      ['With Humble Heart', 171],
      ['In Humility, Our Savior', 172],
      ['While of These Emblems We Partake', 173],
      ['While of These Emblems We Partake', 174],
      ['O God, the Eternal Father', 175],
      ['’Tis Sweet to Sing the Matchless Love', 176],
      ['’Tis Sweet to Sing the Matchless Love', 177],
      ['O Lord of Hosts', 178],
      ['Again, Our Dear Redeeming Lord', 179],
      ['Father in Heaven, We Do Believe', 180],
      ['Jesus of Nazareth, Savior and King', 181],
      ['We’ll Sing All Hail to Jesus’ Name', 182],
      ['In Remembrance of Thy Suffering', 183],
      ['Upon the Cross of Calvary', 184],
      ['Reverently and Meekly Now', 185],
      ['Again We Meet around the Board', 186],
      ['God Loved Us, So He Sent His Son', 187],
      ['Thy Will, O Lord, Be Done', 188],
      ['O Thou, Before the World Began', 189],
      ['In Memory of the Crucified', 190],
      ['Behold the Great Redeemer Die', 191],
      ['He Died! The Great Redeemer Died', 192],
      ['I Stand All Amazed', 193],
      ['There Is a Green Hill Far Away', 194],
      ['How Great the Wisdom and the Love', 195],
      ['Jesus, Once of Humble Birth', 196],
      ['O Savior, Thou Who Wearest a Crown', 197],
      ['That Easter Morn', 198],
      ['He Is Risen!', 199],
      ['Christ the Lord Is Risen Today', 200],
      ['Joy to the World', 201],
      ['Oh, Come, All Ye Faithful', 202],
      ['Angels We Have Heard on High', 203],
      ['Silent Night', 204],
      ['Once in Royal David’s City', 205],
      ['Away in a Manger', 206],
      ['It Came upon the Midnight Clear', 207],
      ['O Little Town of Bethlehem', 208],
      ['Hark! The Herald Angels Sing', 209],
      ['With Wondering Awe', 210],
      ['While Shepherds Watched Their Flocks', 211],
      ['Far, Far Away on Judea’s Plains', 212],
      ['The First Noel', 213],
      ['I Heard the Bells on Christmas Day', 214],
      ['Ring Out, Wild Bells', 215],
      ['We Are Sowing', 216],
      ['Come, Let Us Anew', 217],
      ['We Give Thee But Thine Own', 218],
      ['Because I Have Been Given Much', 219],
      ['Lord, I Would Follow Thee', 220],
      ['Dear to the Heart of the Shepherd', 221],
      ['Hear Thou Our Hymn, O Lord', 222],
      ['Have I Done Any Good?', 223],
      ['I Have Work Enough to Do', 224],
      ['We Are Marching On to Glory', 225],
      ['Improve the Shining Moments', 226],
      ['There Is Sunshine in My Soul Today', 227],
      ['You Can Make the Pathway Bright', 228],
      ['Today, While the Sun Shines', 229],
      ['Scatter Sunshine', 230],
      ['Father, Cheer Our Souls Tonight', 231],
      ['Let Us Oft Speak Kind Words', 232],
      ['Nay, Speak No Ill', 233],
      ['Jesus, Mighty King in Zion', 234],
      ['Should You Feel Inclined to Censure', 235],
      ['Lord, Accept into Thy Kingdom', 236],
      ['Do What Is Right', 237],
      ['Behold Thy Sons and Daughters, Lord', 238],
      ['Choose the Right', 239],
      ['Know This, That Every Soul Is Free', 240],
      ['Count Your Blessings', 241],
      ['Praise God, from Whom All Blessings Flow', 242],
      ['Let Us All Press On', 243],
      ['Come Along, Come Along', 244],
      ['This House We Dedicate to Thee', 245],
      ['Onward, Christian Soldiers', 246],
      ['We Love Thy House, O God', 247],
      ['Up, Awake, Ye Defenders of Zion', 248],
      ['Called to Serve', 249],
      ['We Are All Enlisted', 250],
      ['Behold! A Royal Army', 251],
      ['Put Your Shoulder to the Wheel', 252],
      ['Like Ten Thousand Legions Marching', 253],
      ['True to the Faith', 254],
      ['Carry On', 255],
      ['As Zion’s Youth in Latter Days', 256],
      ['Rejoice! A Glorious Sound Is Heard', 257],
      ['O Thou Rock of Our Salvation', 258],
      ['Hope of Israel', 259],
      ['Who’s on the Lord’s Side?', 260],
      ['Thy Servants Are Prepared', 261],
      ['Go, Ye Messengers of Glory', 262],
      ['Go Forth with Faith', 263],
      ['Hark, All Ye Nations!', 264],
      ['Arise, O God, and Shine', 265],
      ['The Time Is Far Spent', 266],
      ['How Wondrous and Great', 267],
      ['Come, All Whose Souls Are Lighted', 268],
      ['Jehovah, Lord of Heaven and Earth', 269],
      ['I’ll Go Where You Want Me to Go', 270],
      ['Oh, Holy Words of Truth and Love', 271],
      ['Oh Say, What Is Truth?', 272],
      ['Truth Reflects upon Our Senses', 273],
      ['The Iron Rod', 274],
      ['Men Are That They Might Have Joy', 275],
      ['Come Away to the Sunday School', 276],
      ['As I Search the Holy Scriptures', 277],
      ['Thanks for the Sabbath School', 278],
      ['Thy Holy Word', 279],
      ['Welcome, Welcome, Sabbath Morning', 280],
      ['Help Me Teach with Inspiration', 281],
      ['We Meet Again in Sabbath School', 282],
      ['The Glorious Gospel Light Has Shone', 283],
      ['If You Could Hie to Kolob', 284],
      ['God Moves in a Mysterious Way', 285],
      ['Oh, What Songs of the Heart', 286],
      ['Rise, Ye Saints, and Temples Enter', 287],
      ['How Beautiful Thy Temples, Lord', 288],
      ['Holy Temples on Mount Zion', 289],
      ['Rejoice, Ye Saints of Latter Days', 290],
      ['Turn Your Hearts', 291],
      ['O My Father', 292],
      ['Each Life That Touches Ours for Good', 293],
      ['Love at Home', 294],
      ['O Love That Glorifies the Son', 295],
      ['Our Father, by Whose Name', 296],
      ['From Homes of Saints Glad Songs Arise', 297],
      ['Home Can Be a Heaven on Earth', 298],
      ['Children of Our Heavenly Father', 299],
      ['Families Can Be Together Forever', 300],
      ['I Am a Child of God', 301],
      ['I Know My Father Lives', 302],
      ['Keep the Commandments', 303],
      ['Teach Me to Walk in the Light', 304],
      ['The Light Divine', 305],
      ['God’s Daily Care', 306],
      ['In Our Lovely Deseret', 307],
      ['Love One Another', 308],
      ['As Sisters in Zion (Women)', 309],
      ['A Key Was Turned in Latter Days (Women)', 310],
      ['We Meet Again as Sisters (Women)', 311],
      ['We Ever Pray for Thee (Women)', 312],
      ['God Is Love (Women)', 313],
      ['How Gentle God’s Commands (Women)', 314],
      ['Jesus, the Very Thought of Thee (Women)', 315],
      ['The Lord Is My Shepherd (Women)', 316],
      ['Sweet Is the Work (Women)', 317],
      ['Love at Home (Women)', 318],
      ['Ye Elders of Israel (Men)', 319],
      ['The Priesthood of Our Lord (Men)', 320],
      ['Ye Who Are Called to Labor (Men)', 321],
      ['Come, All Ye Sons of God (Men)', 322],
      ['Rise Up, O Men of God (Men’s Choir)', 323],
      ['Rise Up, O Men of God (Men)', 324],
      ['See the Mighty Priesthood Gathered (Men’s Choir)', 325],
      ['Come, Come, Ye Saints (Men’s Choir)', 326],
      ['Go, Ye Messengers of Heaven (Men’s Choir)', 327],
      ['An Angel from on High (Men’s Choir)', 328],
      ['Thy Servants Are Prepared (Men’s Choir)', 329],
      ['See, the Mighty Angel Flying (Men’s Choir)', 330],
      ['Oh Say, What Is Truth? (Men’s Choir)', 331],
      ['Come, O Thou King of Kings (Men’s Choir)', 332],
      ['High on the Mountain Top (Men’s Choir)', 333],
      ['I Need Thee Every Hour (Men’s Choir)', 334],
      ['Brightly Beams Our Father’s Mercy (Men’s Choir)', 335],
      ['School Thy Feelings (Men’s Choir)', 336],
      ['O Home Beloved (Men’s Choir)', 337],
      ['America the Beautiful', 338],
      ['My Country, ’Tis of Thee', 339],
      ['The Star-Spangled Banner', 340],
      ['God Save the King', 341],
    ]
  end
end