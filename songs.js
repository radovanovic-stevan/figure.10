// Quiz data: one entry per song, with a few short lyric excerpts each.
// " / " in an excerpt marks a line break.
// `aliases` are extra accepted answers (matching already ignores case,
// spaces and punctuation, so they're only needed for genuinely different spellings).

const ALBUMS = [
  { id: "ht",  name: "Hybrid Theory",       year: 2000, color: "#c9b48a" },
  { id: "met", name: "Meteora",             year: 2003, color: "#f08a24" },
  { id: "mtm", name: "Minutes to Midnight", year: 2007, color: "#e8e8e8" },
  { id: "ats", name: "A Thousand Suns",     year: 2010, color: "#ff3b30" },
  { id: "lt",  name: "Living Things",       year: 2012, color: "#7fc8e0" },
  { id: "thp", name: "The Hunting Party",   year: 2014, color: "#e6c229" },
  { id: "oml", name: "One More Light",      year: 2017, color: "#ff9fb2" },
  { id: "fz",  name: "From Zero",           year: 2024, color: "#b47cff" },
];

const SONGS = [
  // ---------- Hybrid Theory ----------
  { title: "Papercut", album: "ht", lyrics: [
    "Why does it feel like night today? / Something in here's not right today",
    "It's like I'm paranoid lookin' over my back / It's like a whirlwind inside of my head",
    "A face that laughs every time I fall",
  ]},
  { title: "One Step Closer", album: "ht", lyrics: [
    "I cannot take this anymore / Saying everything I've said before",
    "All these words, they make no sense / I find bliss in ignorance",
    "I find the answers aren't so clear / Wish I could find a way to disappear",
  ]},
  { title: "With You", album: "ht", lyrics: [
    "I woke up in a dream today to the cold of the static / And put my cold feet on the floor",
    "The sound of your voice / Painted on my memories",
    "No matter how far we've come / I can't wait to see tomorrow",
  ]},
  { title: "Points of Authority", album: "ht", lyrics: [
    "Forfeit the game before somebody else / Takes you out of the frame",
    "You love the way I look at you / While taking pleasure in the awful things you put me through",
    "You like to think you're never wrong / You have to act like you're someone",
  ]},
  { title: "Crawling", album: "ht", lyrics: [
    "These wounds, they will not heal / Fear is how I fall",
    "There's something inside me / That pulls beneath the surface",
    "Against my will, I stand beside my own reflection",
  ]},
  { title: "Runaway", album: "ht", lyrics: [
    "Graffiti decorations / Under the sky of dust",
    "A constant wave of tension / On top of broken trust",
    "Paper bags and angry voices / Under a sky of dust",
  ]},
  { title: "By Myself", album: "ht", lyrics: [
    "Do I trust some and get fooled by phoniness? / Or do I trust nobody and live in loneliness?",
    "I put on my daily façade, but then / I just end up getting hurt again",
    "If I'm killed by the questions like a cancer / Then I'll be buried in the silence of the answer",
  ]},
  { title: "In the End", album: "ht", lyrics: [
    "It starts with one thing, I don't know why",
    "Time is a valuable thing / Watch it fly by as the pendulum swings",
    "I had to fall to lose it all",
  ]},
  { title: "A Place for My Head", album: "ht", lyrics: [
    "I watch how the moon sits in the sky in the dark night / Shining with the light from the sun",
    "I'm sick of the tension, sick of the hunger",
    "I wanna be in the energy / Not with the enemy",
  ]},
  { title: "Forgotten", album: "ht", lyrics: [
    "From the top to the bottom, bottom to top, I stop",
    "In the memory, you'll find me, eyes burning up",
    "When the paper's crumpled up, it can't be perfect again",
  ]},
  { title: "Pushing Me Away", album: "ht", lyrics: [
    "This is the last smile / That I'll fake for the sake of being with you",
    "Even the people who never frown eventually break down",
    "Why I never walked away? / Why I played myself this way?",
  ]},

  // ---------- Meteora ----------
  { title: "Don't Stay", album: "met", lyrics: [
    "Sometimes I need to remember just to breathe",
    "Forget our memories / Forget our possibilities",
    "Take all your faithlessness with you",
  ]},
  { title: "Somewhere I Belong", album: "met", lyrics: [
    "And I get lost in the nothingness inside of me",
    "I wanna heal, I wanna feel, what I thought was never real",
    "I will never know myself until I do this on my own",
  ]},
  { title: "Lying from You", album: "met", lyrics: [
    "When I pretend everything is what I want it to be",
    "I remember what they taught to me / Remember condescending talk of who I ought to be",
    "The very worst part of you is me",
  ]},
  { title: "Hit the Floor", album: "met", lyrics: [
    "There are just too many times that people have tried to look inside of me",
    "One minute you're on top / The next you're not, watch it drop",
    "So many people like me walk on eggshells all day long",
  ]},
  { title: "Easier to Run", album: "met", lyrics: [
    "Something has been taken from deep inside of me",
    "If I could change, I would, take back the pain, I would",
    "Wounds so deep, they never show, they never go away",
  ]},
  { title: "Faint", album: "met", lyrics: [
    "I am a little bit of loneliness, a little bit of disregard",
    "Don't turn your back on me; I won't be ignored",
    "Time won't heal this damage anymore",
  ]},
  { title: "Figure.09", album: "met", aliases: ["Figure 9", "Figure Nine"], lyrics: [
    "I think of how I shot myself in the back again",
    "I took what I hated and made it a part of me",
    "Giving up a part of me, I've let myself become you",
  ]},
  { title: "Breaking the Habit", album: "met", lyrics: [
    "Memories consume, like opening the wound / I'm picking me apart again",
    "I don't know what's worth fighting for or why I have to scream",
    "Clutching my cure, I tightly lock the door",
  ]},
  { title: "From the Inside", album: "met", lyrics: [
    "I don't know who to trust, no surprise",
    "'Cause I swear, for the last time / I won't trust myself with you",
    "Tension is building inside, steadily",
  ]},
  { title: "Nobody's Listening", album: "met", lyrics: [
    "Peep the style and the kids checking for it / The number one question is how could you ignore it?",
    "I got a heart full of pain, head full of stress / Handful of anger held in my chest",
    "Not to be forgotten but still unforgiven",
  ]},
  { title: "Numb", album: "met", lyrics: [
    "I'm tired of being what you want me to be",
    "Caught in the undertow, just caught in the undertow",
    "All I want to do / Is be more like me and be less like you",
  ]},

  // ---------- Minutes to Midnight ----------
  { title: "Given Up", album: "mtm", lyrics: [
    "Wake in a sweat again / Another day's been laid to waste in my disgrace",
    "I'm my own worst enemy",
    "Looking for help somehow somewhere and no one cares",
  ]},
  { title: "Leave Out All the Rest", album: "mtm", lyrics: [
    "I dreamed I was missing / You were so scared",
    "Help me leave behind some reasons to be missed",
    "I've never been perfect / But neither have you",
  ]},
  { title: "Bleed It Out", album: "mtm", lyrics: [
    "Here we go for the hundredth time / Hand grenade pins in every line",
    "Shotgun opera, lock and load",
    "I've opened up these scars / I'll make you face this",
  ]},
  { title: "Shadow of the Day", album: "mtm", lyrics: [
    "I close both locks below the window / I close both blinds and turn away",
    "Sometimes goodbye's the only way",
    "Cards and flowers on your window / Your friends all plead for you to stay",
  ]},
  { title: "What I've Done", album: "mtm", lyrics: [
    "In this farewell / There's no blood, there's no alibi",
    "'Cause I've drawn regret / From the truth of a thousand lies",
    "While I clean this slate / With the hands of uncertainty",
  ]},
  { title: "Hands Held High", album: "mtm", lyrics: [
    "Turn my mic up louder, I got to say something",
    "Like it's stupid standing for what I'm standing for",
    "Stuttering and mumbling for nightly news to replay",
  ]},
  { title: "No More Sorrow", album: "mtm", lyrics: [
    "Are you lost in your lies? / Do you tell yourself I don't realize?",
    "Replaced freedom with fear, you trade money for lives",
    "I see liars and thieves abuse power with greed",
  ]},
  { title: "Valentine's Day", album: "mtm", lyrics: [
    "My insides all turned to ash, so slow",
    "I used to be my own protection, but not now",
    "A black wind took them away from sight",
  ]},
  { title: "In Between", album: "mtm", lyrics: [
    "Let me apologize to begin with",
    "But trying to be genuine was harder than it seemed",
    "Between my pride and my promise",
  ]},
  { title: "In Pieces", album: "mtm", lyrics: [
    "Your lips say that you love / Your eyes say that you hate",
    "There's truth in your lies / Doubt in your faith",
    "You promised me the sky / Then tossed me like a stone",
  ]},
  { title: "The Little Things Give You Away", album: "mtm", lyrics: [
    "Water grey / Through the windows, up the stairs",
    "And now there will be no mistaking / The levees are breaking",
    "And six feet underwater / I do",
  ]},

  // ---------- A Thousand Suns ----------
  { title: "Burning in the Skies", album: "ats", lyrics: [
    "I used the deadwood to make the fire rise",
    "I'm swimming in the smoke of bridges I have burned",
    "Like separate chambers of the human heart",
  ]},
  { title: "When They Come for Me", album: "ats", lyrics: [
    "I'm not a criminal / Not a role model",
    "I'm not a robot / I'm not a monkey / I will not dance even if the beat's funky",
    "I am not a pattern to be followed",
  ]},
  { title: "Robot Boy", album: "ats", lyrics: [
    "You say, you're not gonna fight 'cause no one will fight for you",
    "And you think, compassion's a flaw, and you'll never let it show",
    "The weight of the world will give you the strength to go",
  ]},
  { title: "Waiting for the End", album: "ats", lyrics: [
    "Just a voice like a riot / Rocking every revision",
    "What was left when the fire was gone? / I thought I found right but that right was wrong",
    "Holding on to what I haven't got",
  ]},
  { title: "Blackout", album: "ats", lyrics: [
    "I'm stuck in this bed you made / Alone with a sinking feeling",
    "It's written upon your face / All the lies, how they cut so deeply",
    "Floating down / As colors fill the light",
  ]},
  { title: "Wretches and Kings", album: "ats", lyrics: [
    "To save face, how low can you go?",
    "The people up top push the people down low",
    "Steel unload, final blow / We the animals take control",
  ]},
  { title: "Iridescent", album: "ats", lyrics: [
    "When you were standing in the wake of devastation",
    "Remember all the sadness and frustration / And let it go",
    "You felt the gravity of tempered grace / Falling into empty space",
  ]},
  { title: "The Catalyst", album: "ats", lyrics: [
    "We're a broken people living under loaded gun",
    "Will we burn inside the fires of a thousand suns?",
    "To symphonies of blinding light",
  ]},
  { title: "The Messenger", album: "ats", lyrics: [
    "When you've suffered enough / And your spirit is breaking",
    "When life leaves us blind / Love keeps us kind",
    "Listen to your heart / Those angel voices",
  ]},

  // ---------- Living Things ----------
  { title: "Lost in the Echo", album: "lt", lyrics: [
    "You were that foundation / Never gonna be another one, no",
    "In these promises broken, deep below / Each word gets lost in the echo",
    "Hold myself up and love my scars",
  ]},
  { title: "In My Remains", album: "lt", lyrics: [
    "Separate / Sifting through the wreckage / I can't concentrate",
    "Set the silence free / To wash away the worst of me",
    "Like an army, falling / One by one by one",
  ]},
  { title: "Burn It Down", album: "lt", lyrics: [
    "The cycle repeated / As explosions broke in the sky",
    "I played soldier, you played king / Struck me down when I kissed that ring",
    "The colors conflicted / As the flames climbed into the clouds",
  ]},
  { title: "Lies Greed Misery", album: "lt", aliases: ["Lies, Greed, Misery"], lyrics: [
    "I'ma be that nail in your coffin",
    "Now, let me show you / Exactly how the breaking point sounds",
    "You did it to yourself and it's over",
  ]},
  { title: "I'll Be Gone", album: "lt", lyrics: [
    "Like shining oil, this night is dripping down",
    "When the lights go out and we open our eyes",
    "This air between us is getting thinner now / Into winter now, bittersweet",
  ]},
  { title: "Castle of Glass", album: "lt", lyrics: [
    "Take me down to the river bend / Take me down to the fightin' end",
    "Fly me up on a silver wing / Past the black where the sirens sing",
    "Warm me up in a nova's glow / And drop me down to the dream below",
  ]},
  { title: "Victimized", album: "lt", lyrics: [
    "No regret for the confidence betrayed / No more hiding in shadow",
    "For you snakes in the grass, supplying the venom",
    "I ain't scared of your teeth, I admire what's in 'em",
  ]},
  { title: "Roads Untraveled", album: "lt", lyrics: [
    "'Cause beyond every bend is a long blinding end",
    "'Cause the love that you lost wasn't worth what it cost",
    "May your love never end, and if you need a friend",
  ]},
  { title: "Skin to Bone", album: "lt", lyrics: [
    "Ash to ashes, dust to dust",
    "Your deception, my disgust",
    "As the starlight fades to grey / I'll be marching far away",
  ]},
  { title: "Until It Breaks", album: "lt", lyrics: [
    "I was born with the hunger of a lion, the strength of a sun",
    "My mama taught me words, my daddy built rockets",
    "Give me the strength of the rising sun / Give me the truth of the words unsung",
  ]},
  { title: "Powerless", album: "lt", lyrics: [
    "You hid your skeletons when I had shown you mine",
    "Ten thousand promises, ten thousand ways to lose",
    "I'm left with emptiness that words cannot defend",
  ]},

  // ---------- The Hunting Party ----------
  { title: "Keys to the Kingdom", album: "thp", lyrics: [
    "No control, no surprise!",
    "Careful what you shoot for, 'cause you might hit what you aim for",
    "I'm my own casualty, I fuck up everything I see",
  ]},
  { title: "All for Nothing", album: "thp", lyrics: [
    "So what you waiting for, anticipating more",
    "Your word, obeyed / My debt, repaid / Our trust, betrayed",
    "I'm a five-star general infantry controller",
  ]},
  { title: "Guilty All the Same", album: "thp", lyrics: [
    "Tell us all again / What you think we should be",
    "Too sick to be ashamed / You want to point your finger",
    "Show us all again / That our hands are unclean",
  ]},
  { title: "War", album: "thp", lyrics: [
    "There's no peace, only war",
    "Victory decides who's wrong or right",
    "Forever black eternal night",
  ]},
  { title: "Wastelands", album: "thp", lyrics: [
    "This is war with no weapons, marching with no stepping",
    "Where there's nothing left to lose / And there's nothing more to take",
    "Where tomorrow disappears / While the future slips away",
  ]},
  { title: "Until It's Gone", album: "thp", lyrics: [
    "A fire needs a space to burn / A breath to build a glow",
    "I thought I kept you safe and sound / I thought I made you strong",
    "'Cause finding what you've got sometimes / Means finding it alone",
  ]},
  { title: "Rebellion", album: "thp", lyrics: [
    "I've seen the blood / I've seen the broken",
    "We are the fortunate ones / Who've never faced oppression's gun",
    "We lost before the start / One by one / We fall apart",
  ]},
  { title: "Mark the Graves", album: "thp", lyrics: [
    "There's a fragile game you play with the ghosts of yesterday",
    "And the blood may wash away but the scars will never fade",
    "At least I know somehow I made a mark",
  ]},
  { title: "Final Masquerade", album: "thp", lyrics: [
    "Tearing me apart with / Words you wouldn't say",
    "'Cause I don't have a reason / And you don't have the time",
    "The light on the horizon / Was brighter yesterday",
  ]},
  { title: "A Line in the Sand", album: "thp", lyrics: [
    "Today / We stood on the wall / We laughed at the sun",
    "You had sold me an ocean / And I was lost in the flood",
    "You were steady as a sniper / We were waiting on a wire",
  ]},

  // ---------- One More Light ----------
  { title: "Nobody Can Save Me", album: "oml", lyrics: [
    "I'm dancing with my demons / I'm hanging off the edge",
    "Storm clouds gather beneath me / Waves break above my head",
    "Headfirst hallucination / I wanna fall wide awake now",
  ]},
  { title: "Good Goodbye", album: "oml", lyrics: [
    "So say goodbye and hit the road / Pack it up and disappear",
    "'Cause you can't come back around here",
    "Live from the Genesis / Underline it for emphasis",
  ]},
  { title: "Talking to Myself", album: "oml", lyrics: [
    "Tell me what I've gotta do / There's no getting through to you",
    "The lights are on, but nobody's home",
    "You keep running like the sky is falling",
  ]},
  { title: "Battle Symphony", album: "oml", lyrics: [
    "I got a long way to go and a long memory",
    "If my armor breaks, I'll fuse it back together",
    "That I'm marching to the rhythm of a lonesome defeat",
  ]},
  { title: "Invisible", album: "oml", lyrics: [
    "I've got an aching head / Echoes and buzzing noises",
    "This is not black and white / Only organized confusion",
    "If I cannot break your fall / I'll pick you up right off the ground",
  ]},
  { title: "Heavy", album: "oml", lyrics: [
    "I don't like my mind right now",
    "I wanna let go, but there's comfort in the panic",
    "I know I'm not the center of the universe",
  ]},
  { title: "Sorry for Now", album: "oml", lyrics: [
    "Watching the wings cut through the clouds",
    "Sometimes things refuse to go the way we planned",
    "Switching time zones, can't pick the pace up",
  ]},
  { title: "Halfway Right", album: "oml", lyrics: [
    "I scream at myself when there's nobody else to fight",
    "Used to get high with the dead end kids",
    "You burn too bright, you know you'll never last",
  ]},
  { title: "One More Light", album: "oml", lyrics: [
    "Should've stayed, were there signs I ignored?",
    "In the kitchen, one more chair than you need",
    "Just 'cause you can't see it doesn't mean it isn't there",
  ]},
  { title: "Sharp Edges", album: "oml", lyrics: [
    "Don't you run with scissors, son / You're gonna hurt someone",
    "Every scar is a story I can tell",
    "Loved you like a house of cards / Let it fall apart",
  ]},

  // ---------- From Zero ----------
  { title: "The Emptiness Machine", album: "fz", lyrics: [
    "Your blades are sharpened with precision",
    "Gave up who I am for who you wanted me to be",
    "Going around like a revolver",
  ]},
  { title: "Cut the Bridge", album: "fz", lyrics: [
    "Every time you start, it's like the fourth day of July",
    "Knowin' you would burn it just to watch it burn",
    "I was sittin' on the dynamite for you to light the fuse",
  ]},
  { title: "Heavy Is the Crown", album: "fz", lyrics: [
    "You can't win if your white flag's out when the war begins",
    "Fire in the sunrise, ashes rainin' down",
    "'Cause I'm tired of explainin' what the joke is",
  ]},
  { title: "Over Each Other", album: "fz", lyrics: [
    "This is the letter that I / I didn't write",
    "Skyscrapers we created / On shaky ground",
    "Reaching for satellites",
  ]},
  { title: "Casualty", album: "fz", lyrics: [
    "Let me out, set me free / I know all the secrets you keep",
    "You drew the first blood / Like playing God",
    "Closing the doors up while I'm fed to the dogs",
  ]},
  { title: "Overflow", album: "fz", lyrics: [
    "We're all dressed up for a riot / Catching fire, fighting fire",
    "Turnin' from a white sky to a black hole",
    "I can hear the future callin'",
  ]},
  { title: "Two Faced", album: "fz", lyrics: [
    "Last time, I was hanging by a thread",
    "Your truth's not rigid, your rules aren't fair",
    "Too late, countin' to zero",
  ]},
  { title: "Stained", album: "fz", lyrics: [
    "Hand on my mouth, I shouldn't have said it",
    "Close-lipped smile because there's blood on your teeth",
    "You try to hide the mark, but it won't fade",
  ]},
  { title: "IGYEIH", album: "fz", aliases: ["I Give You Everything I Have"], lyrics: [
    "Your remedies hypnotize / I never say \"stop\"",
    "Just a devil with a god complex",
    "I write all the memories down / All over my skin",
  ]},
  { title: "Good Things Go", album: "fz", lyrics: [
    "Feels like it's rained in my head for a hundred days",
    "Stare in the mirror and I look for another face",
    "It's hard to laugh when I'm the joke",
  ]},
];
