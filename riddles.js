/**
 * RiddleDaily — Pre-loaded riddle library (55 riddles)
 * Each riddle: id, text, answer, hints[], category, difficulty, keywords[]
 */
export const RIDDLE_CATEGORIES = [
  'Logic',
  'Wordplay',
  'Math',
  'Lateral Thinking',
  'Classic',
  'Science',
  'Nature'
];

export const RIDDLE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const BUILTIN_RIDDLES = [
  {
    id: 1,
    text: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "echo",
    hints: ["Think about sound bouncing back.", "Caves and mountains love me."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["sound", "voice", "nature"]
  },
  {
    id: 2,
    text: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hints: ["You make them when you walk.", "They're left on the ground."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["walk", "trail"]
  },
  {
    id: 3,
    text: "What has keys but can't open locks?",
    answer: "piano",
    hints: ["It's a musical instrument.", "Black and white tiles might help."],
    category: "Wordplay",
    difficulty: "Easy",
    keywords: ["music", "keys"]
  },
  {
    id: 4,
    text: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    hints: ["You use me when traveling.", "Paper or digital, I show the world."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["geography", "travel"]
  },
  {
    id: 5,
    text: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hints: ["You'll find me on envelopes.", "I help mail get delivered."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["mail", "post"]
  },
  {
    id: 6,
    text: "What gets wetter the more it dries?",
    answer: "towel",
    hints: ["You use me after a shower.", "I absorb moisture."],
    category: "Wordplay",
    difficulty: "Easy",
    keywords: ["bathroom", "dry"]
  },
  {
    id: 7,
    text: "I have branches, but no fruit, trunk, or leaves. What am I?",
    answer: "bank",
    hints: ["People visit me with money.", "I have tellers and ATMs."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["money", "finance"]
  },
  {
    id: 8,
    text: "What has a head and a tail but no body?",
    answer: "coin",
    hints: ["You flip me to make decisions.", "I jingle in your pocket."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["money", "flip"]
  },
  {
    id: 9,
    text: "If you multiply me by any number, the result is always the same. What number am I?",
    answer: "zero",
    hints: ["I'm the nothing that changes everything.", "Any number times me equals me."],
    category: "Math",
    difficulty: "Easy",
    keywords: ["arithmetic", "number"]
  },
  {
    id: 10,
    text: "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?",
    answer: "monopoly",
    hints: ["It's a board game scenario.", "Think about passing Go."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["game", "board"]
  },
  {
    id: 11,
    text: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: "m",
    hints: ["Look at the spelling, not the meaning.", "It's a single letter."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["letter", "spelling"]
  },
  {
    id: 12,
    text: "I am always hungry and must always be fed. The finger I touch will soon turn red. What am I?",
    answer: "fire",
    hints: ["I need fuel to survive.", "Don't touch me — you'll get burned."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["flame", "burn"]
  },
  {
    id: 13,
    text: "What has many teeth but cannot bite?",
    answer: "comb",
    hints: ["You use me on your hair.", "I have rows of fine points."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["hair", "grooming"]
  },
  {
    id: 14,
    text: "What can you catch but not throw?",
    answer: "cold",
    hints: ["It's an illness.", "You might catch it in winter."],
    category: "Wordplay",
    difficulty: "Easy",
    keywords: ["sick", "health"]
  },
  {
    id: 15,
    text: "I shave every day, yet my beard stays the same. Who am I?",
    answer: "barber",
    hints: ["It's a profession.", "I cut other people's hair."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["job", "hair"]
  },
  {
    id: 16,
    text: "What has one eye but cannot see?",
    answer: "needle",
    hints: ["I'm used for sewing.", "Thread goes through my eye."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["sew", "thread"]
  },
  {
    id: 17,
    text: "What goes up but never comes down?",
    answer: "age",
    hints: ["Everyone gains it over time.", "Birthdays increase it."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["time", "birthday"]
  },
  {
    id: 18,
    text: "A rooster lays an egg on the peak of a roof. Which way does it roll?",
    answer: "roosters don't lay eggs",
    hints: ["Check your assumptions.", "Think about who lays eggs."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["trick", "assumption"]
  },
  {
    id: 19,
    text: "What invention lets you look right through a wall?",
    answer: "window",
    hints: ["It's made of glass.", "You see through me every day."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["glass", "house"]
  },
  {
    id: 20,
    text: "If two's company and three's a crowd, what are four and five?",
    answer: "nine",
    hints: ["This is a math pun.", "Add them together."],
    category: "Math",
    difficulty: "Easy",
    keywords: ["addition", "pun"]
  },
  {
    id: 21,
    text: "What has hands but cannot clap?",
    answer: "clock",
    hints: ["I tell time.", "I have a face too."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["time", "watch"]
  },
  {
    id: 22,
    text: "What can fill a room but takes up no space?",
    answer: "light",
    hints: ["Flip a switch and I appear.", "Darkness is my absence."],
    category: "Science",
    difficulty: "Medium",
    keywords: ["brightness", "physics"]
  },
  {
    id: 23,
    text: "I have a neck but no head. I wear a cap. What am I?",
    answer: "bottle",
    hints: ["I hold liquids.", "Wine and water live inside me."],
    category: "Wordplay",
    difficulty: "Easy",
    keywords: ["drink", "container"]
  },
  {
    id: 24,
    text: "What disappears as soon as you say its name?",
    answer: "silence",
    hints: ["Breaking me makes noise.", "Quiet rooms have lots of me."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["quiet", "sound"]
  },
  {
    id: 25,
    text: "A plane crashes on the border of the USA and Canada. Where do they bury the survivors?",
    answer: "you don't bury survivors",
    hints: ["Read the question carefully.", "Survivors are alive."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["trick", "reading"]
  },
  {
    id: 26,
    text: "What has words but never speaks?",
    answer: "book",
    hints: ["You read me.", "Libraries are full of me."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["read", "library"]
  },
  {
    id: 27,
    text: "What runs but never walks, has a mouth but never talks?",
    answer: "river",
    hints: ["I flow downhill.", "Fish swim in me."],
    category: "Nature",
    difficulty: "Easy",
    keywords: ["water", "stream"]
  },
  {
    id: 28,
    text: "What is full of holes but still holds water?",
    answer: "sponge",
    hints: ["You use me for cleaning.", "I absorb liquids."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["clean", "absorb"]
  },
  {
    id: 29,
    text: "What month has 28 days?",
    answer: "all of them",
    hints: ["Don't focus on February alone.", "Every month has at least 28."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["calendar", "trick"]
  },
  {
    id: 30,
    text: "What building has the most stories?",
    answer: "library",
    hints: ["Stories can mean tales.", "Books, not floors."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["books", "pun"]
  },
  {
    id: 31,
    text: "I am taken from a mine and shut in a wooden case, from which I am never released, yet I am used by almost everyone. What am I?",
    answer: "pencil lead",
    hints: ["Graphite comes from mines.", "You write with me."],
    category: "Classic",
    difficulty: "Hard",
    keywords: ["write", "graphite"]
  },
  {
    id: 32,
    text: "What can you hold in your right hand but never in your left hand?",
    answer: "your left hand",
    hints: ["Think about anatomy.", "Your right hand can grip something specific."],
    category: "Lateral Thinking",
    difficulty: "Hard",
    keywords: ["body", "trick"]
  },
  {
    id: 33,
    text: "What is always in front of you but can't be seen?",
    answer: "future",
    hints: ["It hasn't happened yet.", "Tomorrow is part of me."],
    category: "Logic",
    difficulty: "Medium",
    keywords: ["time", "tomorrow"]
  },
  {
    id: 34,
    text: "If there are 3 apples and you take away 2, how many do you have?",
    answer: "two",
    hints: ["Read who 'you' refers to.", "You took 2 apples."],
    category: "Math",
    difficulty: "Easy",
    keywords: ["trick", "apples"]
  },
  {
    id: 35,
    text: "What breaks yet never falls, and what falls yet never breaks?",
    answer: "day and night",
    hints: ["Two things that alternate.", "One brings light, one brings darkness."],
    category: "Classic",
    difficulty: "Hard",
    keywords: ["time", "sky"]
  },
  {
    id: 36,
    text: "What has a bottom at the top?",
    answer: "legs",
    hints: ["They're part of your body.", "You sit on them."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["body", "pun"]
  },
  {
    id: 37,
    text: "What kind of coat is always wet when you put it on?",
    answer: "coat of paint",
    hints: ["It's not clothing.", "Walls get one."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["paint", "pun"]
  },
  {
    id: 38,
    text: "What has four wheels and flies?",
    answer: "garbage truck",
    hints: ["The 'flies' part is tricky.", "It collects trash around town."],
    category: "Lateral Thinking",
    difficulty: "Medium",
    keywords: ["vehicle", "pun"]
  },
  {
    id: 39,
    text: "What goes through towns and over hills but never moves?",
    answer: "road",
    hints: ["Cars travel on me.", "I'm paved or gravel."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["travel", "path"]
  },
  {
    id: 40,
    text: "What has a ring but no finger?",
    answer: "telephone",
    hints: ["It makes a sound.", "Older ones had bells."],
    category: "Classic",
    difficulty: "Medium",
    keywords: ["call", "sound"]
  },
  {
    id: 41,
    text: "I am light as a feather, yet the strongest person can't hold me for five minutes. What am I?",
    answer: "breath",
    hints: ["You do it without thinking.", "Hold it and you'll see."],
    category: "Science",
    difficulty: "Medium",
    keywords: ["air", "lungs"]
  },
  {
    id: 42,
    text: "What comes down but never goes up?",
    answer: "rain",
    hints: ["Clouds release me.", "You need an umbrella."],
    category: "Nature",
    difficulty: "Easy",
    keywords: ["weather", "water"]
  },
  {
    id: 43,
    text: "What has a face and two hands but no arms or legs?",
    answer: "clock",
    hints: ["I tick on the wall.", "I tell you when to wake up."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["time", "watch"]
  },
  {
    id: 44,
    text: "What five-letter word becomes shorter when you add two letters to it?",
    answer: "short",
    hints: ["Add 'er' to the end.", "The word describes length."],
    category: "Wordplay",
    difficulty: "Hard",
    keywords: ["spelling", "pun"]
  },
  {
    id: 45,
    text: "A man is found dead in a field with an unopened package. How did he die?",
    answer: "parachute",
    hints: ["He fell from the sky.", "The package should have opened."],
    category: "Lateral Thinking",
    difficulty: "Hard",
    keywords: ["mystery", "sky"]
  },
  {
    id: 46,
    text: "What can you break without touching it?",
    answer: "promise",
    hints: ["It's not physical.", "Trust is involved."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["trust", "word"]
  },
  {
    id: 47,
    text: "What has a thumb and four fingers but is not alive?",
    answer: "glove",
    hints: ["You wear me in winter.", "I keep hands warm."],
    category: "Logic",
    difficulty: "Easy",
    keywords: ["winter", "hand"]
  },
  {
    id: 48,
    text: "What gets sharper the more you use it?",
    answer: "brain",
    hints: ["It's inside your head.", "Learning improves it."],
    category: "Logic",
    difficulty: "Medium",
    keywords: ["mind", "learning"]
  },
  {
    id: 49,
    text: "I have lakes with no water, mountains with no stone, and cities with no people. What am I?",
    answer: "map",
    hints: ["Explorers love me.", "I represent the real world."],
    category: "Classic",
    difficulty: "Medium",
    keywords: ["geography", "atlas"]
  },
  {
    id: 50,
    text: "What is so fragile that saying its name breaks it?",
    answer: "silence",
    hints: ["Any sound destroys me.", "Libraries value me."],
    category: "Wordplay",
    difficulty: "Medium",
    keywords: ["quiet", "sound"]
  },
  {
    id: 51,
    text: "What has 13 hearts but no other organs?",
    answer: "deck of cards",
    hints: ["Used in games.", "Hearts is one of the suits."],
    category: "Math",
    difficulty: "Medium",
    keywords: ["cards", "game"]
  },
  {
    id: 52,
    text: "What can run but never walks, has a bed but never sleeps?",
    answer: "river",
    hints: ["My bed is a riverbed.", "I flow to the sea."],
    category: "Nature",
    difficulty: "Easy",
    keywords: ["water", "stream"]
  },
  {
    id: 53,
    text: "What word is spelled incorrectly in every dictionary?",
    answer: "incorrectly",
    hints: ["The answer is in the question.", "It's a meta riddle."],
    category: "Wordplay",
    difficulty: "Hard",
    keywords: ["spelling", "meta"]
  },
  {
    id: 54,
    text: "If you drop me I'm sure to crack, but give me a smile and I'll always smile back. What am I?",
    answer: "mirror",
    hints: ["You see yourself in me.", "I'm made of glass."],
    category: "Classic",
    difficulty: "Easy",
    keywords: ["reflection", "glass"]
  },
  {
    id: 55,
    text: "What connects two people but touches only one?",
    answer: "wedding ring",
    hints: ["It's worn on a finger.", "A ceremony involves it."],
    category: "Lateral Thinking",
    difficulty: "Hard",
    keywords: ["marriage", "jewelry"]
  }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The brain is like a muscle — the more you use it, the stronger it gets.", author: "Unknown" },
  { text: "Curiosity is the wick in the candle of learning.", author: "William Arthur Ward" },
  { text: "A riddle a day keeps mental rust away.", author: "RiddleDaily" },
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
  { text: "Puzzles are the gymnasium of the mind.", author: "RiddleDaily" }
];

export const FUN_FACTS = [
  "The human brain uses about 20% of the body's total energy.",
  "Solving puzzles can improve memory and problem-solving skills.",
  "The oldest known riddle is the Riddle of the Sphinx from Greek mythology.",
  "Your brain generates about 12-25 watts of electricity — enough to power a LED bulb.",
  "Learning new things creates new neural pathways in your brain.",
  "Lateral thinking puzzles were popularized by Edward de Bono in the 1960s.",
  "Regular mental exercise may help reduce cognitive decline as you age."
];
