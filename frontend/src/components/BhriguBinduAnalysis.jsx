import React from 'react';

const BB_NAKSHATRA_DATA = {
  "Ashwini": {
    sign: "Aries",
    careers: [
      "Transportation Industry", "Drivers (Bus, Truck, Taxi, etc.)", "Pilots", "Train Conductors", "Logistics Managers", "Fleet Managers", "Transportation Planners", "Maritime Captains and Crew",
      "Sports-related Occupations", "Athletes", "Coaches", "Sports Agents", "Referees and Umpires", "Sports Analysts",
      "Healthcare Practitioners", "Physiotherapists", "Pharmacists", "Surgeons", "Chemists", "General Practitioners", "Nurses", "Medical Technicians", "Dietitians",
      "Botanical and Agricultural Professionals", "Botanists", "Agricultural Scientists", "Horticulturists", "Farm Managers", "Soil and Plant Scientists",
      "Fitness and Wellness", "Fitness Trainers", "Personal Trainers", "Yoga Instructors", "Nutritionists", "Massage Therapists",
      "Counseling and Specialized Healthcare", "Marriage Counselors", "Childbirth Specialists (Midwives, Doulas)", "Mental Health Therapists",
      "Racing and Adventure Sports", "Motor Sports Drivers", "Adventure Sports Instructors", "Stunt Performers",
      "Jewelry Industry", "Jewelers", "Goldsmiths", "Gemologists",
      "Promotional and Motivational Roles", "Public Relations Specialists", "Motivational Speakers", "Campaign Managers", "Brand Ambassadors", "Event Coordinators"
    ]
  },
  "Bharani": {
    sign: "Aries",
    careers: [
      "Birth and Death-Related Careers", "Fertility Clinics", "Gynecologists", "Midwives", "Morticians", "Morgue Workers", "Funeral Home Workers", "Coffin Makers", "Obituary Writers", "Officials Handling Birth and Death Records",
      "Childcare and Nurturing", "Babysitters", "Nannies", "Nursery School Teachers", "Daycare Workers", "Child Psychologists",
      "Amusement and Entertainment for Children", "Theme Park Workers", "Toy Designers", "Amusement Park Operators", "Children's Entertainers (Clowns, Magicians)", "Game Designers for Kids",
      "Tobacco, Tea, and Coffee Industry", "Tobacco Farmers", "Tea Farmers", "Coffee Farmers", "Cigar Makers", "Baristas", "Tea Tasters", "Tobacco Shop Workers",
      "Culinary and Hospitality Industry", "Cooks", "Chefs", "Caterers", "Hoteliers", "Restaurant Managers", "Food Critics",
      "Film and Entertainment Industry", "Actors", "Directors", "Producers", "Screenwriters", "Film Editors", "Sound Engineers",
      "Photography and Modeling", "Photographers", "Photography Studio Operators", "Models", "Photo Editors",
      "Biological Sciences", "Biologists", "Microbiologists", "Research Scientists", "Lab Technicians",
      "Agriculture and Horticulture", "Seed Industry Workers", "Fertilizer Industry Workers", "Agronomists",
      "Exotic Nightclub Industry", "Nightclub Performers", "DJs", "Bartenders", "Club Managers", "Security Personnel"
    ]
  },
  "Krittika": {
    sign: "Aries & Taurus",
    careers: [
      "Legal and Judicial Careers", "Lawyers", "Judges",
      "Medical Careers", "Surgeons",
      "Martial Arts and Weaponry", "Swordsmen", "Fencers", "Blacksmiths", "Makers of Swords, Knives, and Sharp Instruments",
      "Fire-related Professions", "Fire Dancers", "People Who Make Fire Sacrifices", "Fire Fighters", "Explosive Experts",
      "Sports Involving Precision and Skill", "Professional Dart Players", "Archers",
      "Creative Arts Using Fire-based Processes", "Jewelers", "Glassmakers",
      "Leadership and Authority", "Critics", "Managers", "Generals", "People in Authoritative Positions", "All Military Careers", "Police",
      "Rehabilitation Careers", "Addiction Counselors", "Rehabilitation Specialists", "Dietitians", "Smoking Cessation Therapists",
      "Self-improvement and Assertiveness", "Life Coaches", "Motivational Speakers", "Self-improvement Authors",
      "Personal Care and Grooming", "Barbers", "Hairdressers",
      "Tailoring and Needlework", "Tailors", "Embroiderers", "Vaccinators",
      "Mining and Prospecting", "Gold Diggers", "Miners",
      "Culinary Arts", "Cooks of All Types",
      "Clay and Ceramic Work", "Brickmakers", "Ceramic Artists",
      "Furnace and Tool Making", "Furnace Makers", "Makers of Cooking Utensils", "Makers of Trade Tools"
    ]
  },
  "Rohini": {
    sign: "Taurus",
    careers: [
      "Food and Agriculture", "Farmers", "Agriculturists", "Botanists", "Herbalists", "Food Processors", "Food Handlers",
      "Arts and Entertainment", "Artists", "Musicians", "Actors", "Entertainers", "Leisure Industry Workers",
      "Fashion and Cosmetics", "Fashion Designers", "Cosmetologists", "Beauticians", "Makeup Artists",
      "Jewelry and Gemstones", "Jewelers", "Gemstone Dealers",
      "Interior Design", "Interior Decorators", "Interior Designers",
      "Finance and Banking", "Bankers", "Financiers",
      "Transportation", "Drivers", "Pilots", "Train Conductors", "Logistics Managers", "Fleet Managers",
      "Business", "Business People", "Entrepreneurs", "Business Consultants",
      "Tourism", "Tour Guides", "Travel Agents", "Hotel Staff", "Tourism Managers",
      "Automobile Industry", "Automotive Engineers", "Car Manufacturers", "Mechanics", "Dealership Salespeople",
      "Oil and Petroleum Industry", "Petroleum Engineers", "Oil Rig Workers", "Refinery Workers", "Pipeline Operators",
      "Textile Industry", "Textile Engineers", "Clothing Manufacturers", "Weavers", "Fashion Designers",
      "Shipping Industry", "Maritime Captains", "Ship Crew", "Dock Workers", "Logistics Managers",
      "Food Production, Packaging, and Distribution", "Food Scientists", "Production Line Workers", "Packaging Specialists", "Distribution Managers",
      "Aquatic Products and Liquids", "Fishermen", "Aquaculture Farmers", "Marine Biologists", "Water Quality Specialists", "Brewers", "Winemakers"
    ]
  },
  "Mrigashira": {
    sign: "Taurus & Gemini",
    careers: [
      "Travelers and Explorers", "Travel Guides", "Explorers", "Adventurers", "Travel Writers",
      "Psychics and Astrologers", "Psychics", "Astrologers", "Fortune Tellers",
      "Education", "Teachers (especially those dealing with beginners)", "Tutors", "Early Childhood Educators",
      "Clerical and Commentary", "Clerks", "Commentators", "Administrative Assistants",
      "Artisans and Creative Professions", "Artisans of All Types", "Singers", "Musicians", "Poets", "Linguists", "Romantic Novelists", "Writers", "Thinkers", "Seekers",
      "Gemstone and Earth-related Products", "Gemstone Dealers", "Miners", "Earth Product Traders",
      "Textile and Garment Industry", "Textile Workers", "Garment Manufacturers", "Fashion Designers", "Trendsetters",
      "Animal Care", "Veterinarians", "Pet Groomers", "Animal Trainers", "Pet Sitters", "Animal Shelter Workers",
      "Sales and Advertising", "Salespersons of All Kinds", "Advertising Agency Workers", "Marketing Specialists",
      "Administration and Management", "Administrators", "Office Managers", "Executive Assistants",
      "Landscaping and Agriculture", "Landscapers", "Farmers", "Gardeners", "Forestry Workers",
      "Real Estate and Navigation", "Real Estate Developers", "Map Makers", "Navigators", "Surveyors"
    ]
  },
  "Ardra": {
    sign: "Gemini",
    careers: [
      "Electrical and Electronic Engineering", "Electrical Engineers", "Electricians",
      "Electronic and Computer Industry", "Computer Hardware Engineers", "Electronic Engineers", "Computer Software Developers",
      "Music and Sound Engineering", "Sound Engineers", "Sound Technicians", "Electronic Musicians",
      "Linguistics and Literature", "Linguists (especially English language experts)", "Profound Thinkers", "Philosophers", "Writers", "Novelists (especially of the science fiction genre)",
      "Photography and Special Effects", "Photographers", "Special Effects Technicians (Film Industry)",
      "Gaming and Virtual Reality", "Computer Game Designers", "Sci-fi Enthusiasts", "3D Experts", "Virtual Reality Experts",
      "Mental Sports", "Chess Players", "Scrabble Players", "Bridge Players",
      "Science and Medicine", "Physicists", "Mathematicians", "Researchers", "Scientists", "Surgeons", "Homeopaths", "Allopathic Doctors", "Nuclear Power Plant Workers", "Eye Specialists", "Brain Specialists and Surgeons", "Psychoanalysts", "Psychotherapists",
      "Food Processing and Production", "Food Processing Workers (canned, frozen, and junk food)", "Thieves (illegal activity)", "Legal and Illegal Drug Dealers",
      "Sales and Manipulation", "Sales People (adept at lying and double talk)", "Politicians", "Manipulators",
      "Biotechnology and Chemistry", "Biotechnologists", "Chemotherapists", "Chemical Industry Workers", "Fertilizer Industry Workers", "Pharmaceutical Industry Workers", "Professions Involving Handling Poisons",
      "Investigation and Analysis", "Investigators", "Detectives", "Mystery Solvers", "Analysts of All Types",
      "Lighting and Radiology", "Lighting Experts", "X-ray Specialists"
    ]
  },
  "Punarvasu": {
    sign: "Gemini & Cancer",
    careers: [
      "Writing and Visionary Professions", "Fairy Tale Writers", "Writers on Astrology and Esoteric Subjects", "Visionaries",
      "Travel and Tourism", "Tour Guides", "Travel Agents", "Tourism Managers", "Hotel Staff", "Restaurant Workers",
      "Trades and Sales", "Trades People of All Types", "Sales People", "Recycling Experts",
      "Hospitality and Construction", "Hotel Industry Workers", "Restaurant Industry Workers", "House Construction Companies", "Civil Engineers", "Architects",
      "Education and Philosophy", "Teachers (Schools, Colleges, Universities)", "Psychologists", "Philosophers", "Priests", "Monks", "Gurus", "Preachers (Self-enhancement Techniques)",
      "Trade and History", "Importers and Exporters", "Historians", "Antique Dealers", "Farmers", "Cattle and Sheep Farmers",
      "Innovative Professions", "Innovators", "Communications Jobs", "Radio Industry Workers", "Telephone Industry Workers", "Courier Companies", "Postal Service Workers", "Newspaper Industry Workers", "Mail Order and Home Delivery Business",
      "Property and Maintenance", "Landlords", "Keepers of Temples, Churches, and Religious Buildings", "Home Maintenance Services",
      "Archery and Target Shooting", "Archers", "Target Shooters",
      "Hand-Related Sports", "All Sports Involving Use of Hands", "Patriots", "Aviators", "Astronauts", "Space and Satellite Professionals"
    ]
  },
  "Pushya": {
    sign: "Cancer",
    careers: [
      "Dairy and Food Industry", "Dairy Farmers", "Food Producers", "Drink Producers", "Caterers", "Hoteliers", "Restaurant Workers", "Food Merchants", "Drink Merchants",
      "Politics and Leadership", "Politicians", "Rulers", "Aristocrats",
      "Religious and Spiritual Professions", "Clergy", "Nuns", "Priests", "Gurus", "Spiritual Teachers", "Orthodox Religious Leaders",
      "Psychology and Counseling", "Psychologists", "Counselors", "Psychotherapists",
      "Management and Charitable Organizations", "Managers", "Charity Workers", "Professional Hosts and Hostesses",
      "River and Lake-Related Jobs", "Fishermen", "Boat Operators", "Water Quality Specialists", "Hydrologists",
      "Education and Childcare", "Teachers", "Education Experts", "Childcare Professionals", "Mothers", "Nannies", "Daycare Workers", "Caregivers",
      "Artisans and Creative Professions", "Artisans", "Craftspeople", "Designers",
      "Real Estate and Agriculture", "Real Estate Agents", "Farmers", "Gardeners"
    ]
  },
  "Ashlesha": {
    sign: "Cancer",
    careers: [
      "Dangerous Substances and Chemical Industries", "Professions Dealing with Poisons", "Petroleum Industry Workers", "Chemical Engineers", "Cigarette Industry Workers",
      "Drug-related Professions", "Legal Drug Dealers", "Illegal Drug Dealers", "Drug Pushers",
      "Political and Manipulative Roles", "Self-serving Politicians", "Behind-the-Scenes Manipulators",
      "Psychological and Criminal Professions", "Psychologists", "Con Artists", "Thieves", "Swindlers",
      "Adult and Illicit Professions", "Pornography Industry Workers", "Prostitutes",
      "Careers Involving Reptiles", "Snake Charmers", "Reptile Handlers",
      "Medical and Veterinary Professions", "Allopathic Doctors", "Surgeons", "Pet Snake Owners", "Pet Cat Owners",
      "Wildlife and Law Enforcement", "Poachers", "Secret Service Agents", "Spies", "Lawyers",
      "Sports and Wellness", "Baseball Players", "Yoga Teachers",
      "Esoteric and Psychological Professions", "Tantrics", "Hypnotists", "Psychiatrists", "Spirit Mediums", "Psychics", "False Gurus", "Cult Leaders"
    ]
  },
  "Magha": {
    sign: "Leo",
    careers: [
      "High-Level Administration and Leadership", "Administrators", "Managers", "Those in Direct Touch with Royalty", "Those Who Bestow or Receive Honors", "Super Achievers", "High Government Officials", "Top Professionals", "Entrepreneurs", "Legends", "Bureaucrats", "Aristocrats", "Officials", "Chairmen (Those in Positions of Authority)",
      "Legal and Judicial Professions", "Lawyers", "Advocates", "Judges", "Referees", "Magistrates",
      "Political and Historical Professions", "Politicians", "Historians", "Librarians",
      "Communication and Performance", "Orators", "Dramatists", "Performers",
      "Tradition and Museum Professions", "Upholders of Traditions", "Museum Professionals (Curators, Conservators)", "Dealers in Antiques",
      "Occult and Esoteric Professions", "Occultists", "Black Magicians", "Exorcists", "Astrologers",
      "Archaeology and Ancient Knowledge", "Archaeologists", "Genetic Engineering Experts", "Researchers in Ancient Knowledge", "Monument Preservationists"
    ]
  },
  "Purva Phalguni": {
    sign: "Leo",
    careers: [
      "Products and Industry Related to Women", "Dealers in Women’s Products",
      "Gemstone and Jewelry Industry", "Gemstone Dealers", "Goldsmiths", "Jewellers",
      "Entertainment and Beauty", "Entertainers", "Beauticians", "Makeup Artists", "Models", "Photographers", "Event Managers", "Art Gallery Managers", "Singers (especially Romantic Type)", "Musicians", "Creative Artists",
      "Teaching and Fitness", "Teachers (General)", "Physical Fitness Trainers", "Interior Decorators", "Interior Designers",
      "Marriage and Childbirth", "Marriage Professionals", "Marriage Ceremony Coordinators", "Childbirth Professionals", "Nannies", "Doctors (Naturopaths and Allopaths)", "Sex Therapists", "Sleep Therapists", "Masseurs",
      "Dating and Biologists", "Dating Agency Professionals", "Biologists",
      "Leisure and Tourism", "Leisure Industry Workers", "Tourism Industry Professionals",
      "Incenses and Toiletries", "Production & Distribution of Incenses", "Toiletries and Related Products",
      "Textiles and Secretarial Jobs", "Wool Industry Workers", "Cotton Industry Workers", "Silk Industry Workers", "Secretarial Jobs",
      "Animal Training and Government", "Animal Trainers", "Government Officials", "Executives", "Diplomats"
    ]
  },
  "Uttara Phalguni": {
    sign: "Leo & Virgo",
    careers: [
      "Creative Arts and Entertainment", "Creative Artists", "Musicians", "Entertainers", "Superstars", "Media and Entertainment Industry Professionals",
      "Management and Leadership", "Managers", "Leaders of All Types", "Public Figures (e.g., Sports Superstars)", "Individuals in High Esteem",
      "Religious and Advisory Roles", "Priests", "Heads of Organizations", "Mafia Dons (illicit activities)", "Teachers", "Preachers", "Philanthropists", "Astrologers", "Marriage Counselors", "Sex Therapists",
      "International and Diplomatic Careers", "United Nations Professionals", "International Diplomats", "Founding Fathers", "Patriotic Figures",
      "Financial and Advisory Professions", "Bankers", "Creditors", "Social Workers", "Professional Advisors (Various Fields)"
    ]
  },
  "Hasta": {
    sign: "Virgo",
    careers: [
      "Dexterous and Manual Labor", "Artisans", "Manual Laborers", "Professions Requiring Dexterity of Hand", "Mechanics", "Jewelry Makers", "Origami Experts", "Acrobats", "Gymnasts", "Circus Performers",
      "Creative Writing and Entertainment", "Writers of Fairy Tales", "Stage Magicians", "Swindlers (illicit activities)", "Professional Comedians", "Satirical Novelists", "Radio & Television Commentators", "Speech Therapists", "Newsreaders",
      "Martial Arts and Inventors", "Martial Artists", "Writers (General)", "Inventors",
      "Publishing and Printing", "Publishing Industry Workers", "Printing Industry Workers",
      "Gambling and Financial Markets", "Pickpockets (illicit activities)", "Stock Market Dealers", "Casino Dealers", "Professional Gamblers", "Bookies",
      "Craftsmanship and Trade", "Toy Makers", "Carpenters",
      "Administrative and Support Roles", "Clerks", "Bankers", "Accountants", "Typists", "Cleaners", "Housekeepers", "Servants", "Masseurs", "Doctors", "Physiotherapists",
      "Chemical, Textile, and Food Industries", "Chemical Industry Workers", "Toiletry Industry Workers", "Textile Industry Workers", "Tarot Decorators (if referring to decoration-related work)", "Gardeners", "Farmers", "Agriculturalists", "Food Production, Processing, and Distribution Industry Workers",
      "Personal Grooming and Amusement", "Barbers", "Hairdressers", "Stylists", "Sculptors", "Masons", "Amusement Park Workers",
      "Sales and Illicit Activities", "Salespersons (All Fields)", "Forgers (illicit activities)", "Thieves", "Robbers (Including Safe Opening)"
    ]
  },
  "Chitra": {
    sign: "Virgo & Libra",
    careers: [
      "Special Abilities and Versatility", "Business Experts", "Interior Designers", "Jewelry Makers", "All Types of Craftsmen and Artisans", "Sculptors", "Architects", "Designers", "Fashion Designers", "Models",
      "Fashion and Cosmetic Industry", "Fashion Industry Professionals", "Cosmetic Industry Workers", "Plastic Surgeons",
      "Media and Arts", "Photographers", "Graphic Artists", "Composers", "Orators", "Compeers", "Broadcasters",
      "Specialized Knowledge and Design", "Vaastu/Feng Shui Experts", "Inventors and Producers of Machinery", "Builders of All Kinds", "Landscapers", "Painters",
      "Writing and Theatre", "Screenplay Writers", "Novelists", "Production and Set Designers", "Art Directors", "Theatre Professionals (Including Stage Managers)", "Performers of All Kinds",
      "Music and Advertising", "Jazz Musicians", "Musicians with Original Approaches", "Advertising Industry Professionals"
    ]
  },
  "Swati": {
    sign: "Libra",
    careers: [
      "Business and Trades", "Businessmen", "Trades People of All Types",
      "Sports and Music", "Wrestlers", "All Sports Professionals (especially those relying on breath control)", "Singers", "Musicians Playing Wind Instruments (e.g., Horns, Organ)",
      "Research and Technology", "Researchers", "Inventors", "Technology Experts", "Independent Enterprises",
      "Government and Public Service", "Government-Related Service Professions", "Socialites", "Trade-Union and Working-Class Leaders",
      "Aviation and Transportation", "Aeronautical Industry Professionals", "Pilots", "Aviation Industry Careers", "Transportation Industry Careers",
      "Speech and Communication", "Newsreaders", "Professions Involving Use of Speech",
      "Computer and Software", "Computer Industry Professionals", "Software Industry Professionals",
      "Flexibility and Ingenuity", "Professions Requiring Flexibility and Quick Ingenuity", "Kite Makers",
      "Adventure Sports and Education", "Adventure Sports Professionals (e.g., Skydivers, Balloonists)", "Educators", "Teachers",
      "Legal and Diplomatic Careers", "Lawyers", "Judges", "Politicians", "Diplomats",
      "Hosting and Entertainment", "Hosts and Hostesses"
    ]
  },
  "Vishakha": {
    sign: "Libra & Scorpio",
    careers: [
      "Alcohol and Liquor Industry", "Bartenders", "Alcohol & Liquor Industry Workers",
      "Manual Labor", "Manual Laborers",
      "Fashion and Entertainment", "Fashion Models", "Actresses",
      "Speech and Broadcasting", "TV and Radio Broadcasters", "Professions Involving Use of Speech",
      "Politics and Public Service", "Politicians",
      "Sports and Physical Effort", "Sports Persons (especially those requiring Herculean Efforts)", "Marching Bands",
      "Ideological and Religious Groups", "Cults and Ideological Fanatics", "Religious Fundamentalists", "Professional Agitators",
      "Military and Security", "Soldiers", "Custom and Immigration Officials", "Guards",
      "Arts and Criticism", "Dancers", "Critics",
      "Criminal Activities", "Criminals", "Mafia", "Prostitution", "Militant Revolutionaries"
    ]
  },
  "Anuradha": {
    sign: "Scorpio",
    careers: [
      "Hypnosis and Psychic Professions", "Hypnotists", "Psychic Mediums", "Occultists", "Astrologers", "Spying (including intelligence and espionage)",
      "Night Duty and Cinema-Related Professions", "Occupations Involving Night Duty", "Photographers", "Cinema-Related Professions (e.g., Film Directors, Cinematographers, Production Staff)",
      "Music and Arts", "Musicians", "Artists",
      "Management and Industry", "Managers", "Industrialists", "Promoters",
      "Counseling and Psychology", "Counselors", "Psychologists",
      "Science and Mathematics", "Scientists", "Numerologists", "Statisticians", "Mathematicians",
      "Exploration and Mining", "Explorers", "Miners",
      "Factory and Industrial Work", "Factory Workers",
      "Diplomacy and International Relations", "Diplomats", "Professions Connected with Dealing with Foreign Countries", "Travel and Foreigners",
      "Group Activities", "Careers Requiring Group Activity"
    ]
  },
  "Jyeshtha": {
    sign: "Scorpio",
    careers: [
      "Policing and Security", "Policing Professions (e.g., Police Officers, Detectives)", "Firemen", "Naval Professions", "Military Professions in General",
      "Government and Administration", "Government Officials", "Administrative Posts of All Types", "Politicians", "Bureaucrats", "Trade Unionists",
      "Media and Communication", "Reporters", "Radio Commentators", "Television Commentators", "Newsreaders", "Talk Show Hosts", "Actors", "Orators",
      "Occult and Criminal Activities", "Occultists (Mainly Black Magicians)", "Mafia", "Detectives (also related to policing)",
      "Environmental and Care Professions", "Forest Rangers", "Salvation Army Workers and Other Aged Care Professions",
      "Medical and Physical Professions", "Surgeons", "Manual Laborers", "Athletes (Especially Sprinters)",
      "Technology and Telecommunication", "Telecommunication Industry Professions", "Air Traffic Controllers", "Radar Experts"
    ]
  },
  "Mula": {
    sign: "Sagittarius",
    careers: [
      "Healing and Medical Professions", "Shamans", "Medicine Men", "Healers", "Doctors", "Dentists", "Those Who Administer Poisons, Shots, and Vaccines",
      "Law Enforcement and Investigation", "Police Officers", "Detectives", "Investigators", "Judges", "Homicide Squads",
      "Research and Science", "Researchers (Microbiology & Genetics)", "Astronomers", "Nuclear Physicists", "Mathematicians",
      "Mortuary and Forensic", "Morticians", "Autopsy Performers",
      "Oratory and Public Speaking", "Orators", "Public Speakers", "Mass Leaders", "Rock Musicians (for their oratorical ability in performance)", "Debaters", "Contrarians",
      "Agriculture and Selling", "Selling Herbs, Roots & Root Vegetables (e.g., Carrots, Potatoes)",
      "Security and Physical Professions", "Bodyguards", "Wrestlers",
      "Political and Ideological", "Politicians", "Professional Agitators", "Practitioners of Tantra (especially Aghoras)", "Black Magicians", "Ascetics",
      "Mining and Industry", "Gold Diggers", "Treasure Hunters", "Mining", "Coal Industry", "Petroleum Industry",
      "Psychological and Spiritual", "Psychotherapists", "Astrologers",
      "Investigation and Destruction", "Professions Involving Investigation of Any Kind", "Professions Involving Destructive Activities",
      "Equine and Sports", "Horse Trainers", "Those Involved in Equine Sports"
    ]
  },
  "Purva Ashadha": {
    sign: "Sagittarius",
    careers: [
      "Maritime and Marine", "Sailors", "Navy Personnel", "Marine Life Experts", "Shipping Industry Professionals", "Fishing Professions",
      "Entertainment and Public Speaking", "Professional Hosts & Hostesses", "Entertainment Industry Professionals", "Rock Stars", "Professional Motivators and Inspirers", "Teachers & Preachers of Motivational Philosophies",
      "Creative Arts", "Poets", "Writers", "Artists", "Painters", "Costume Designers", "Fashion Experts",
      "Management and Administration", "Managers of All Types",
      "Beauty and Personal Care", "Hairdressers", "Beauticians", "Herbalists",
      "Adventure and Aviation", "Para Jumpers", "Hot Air Balloonists", "Flying Professionals (Civilian Transport)",
      "Psychological and Spiritual", "Hypnotists", "Psychic Mediums",
      "Amusement and Leisure", "Workers in Amusement Parks",
      "Industrial and Processing", "Industries Processing Raw Materials (especially Liquids)", "Refineries",
      "Warfare and Strategy", "War Strategists",
      "Water and Liquids", "Careers Associated with Water and Liquids in All Forms"
    ]
  },
  "Uttara Ashadha": {
    sign: "Sagittarius & Capricorn",
    careers: [
      "Religious and Counseling Professions", "Preachers", "Priests", "Counselors", "Astrologers", "Psychologists",
      "Legal and Government", "Lawyers (of an Ethical Nature)", "Judges", "Government Officials", "Politicians",
      "Military and Defense", "Military Professions", "Defense Industry Professionals", "Bodyguards", "Security Personnel", "Guards",
      "Combat Sports and Physical Training", "Wrestlers", "Sword Fighters and Other Combat Sports", "Athletes", "Elephant Trainers", "Equine Professions",
      "Exploration and Pioneering", "Pioneers", "Explorers",
      "Business and Management", "Business Executives", "Organizers",
      "Environmental and Wildlife", "Bird Watchers & Enthusiasts", "Rangers", "Hunters",
      "Construction and Industry", "Construction Industry Professionals",
      "Sports", "Cricketers",
      "Holistic and Medical", "Holistic Physicians",
      "Authority and Ethics", "Authority Figures of All Types", "All Professions Requiring a Sense of Responsibility and Ethics", "High-Class Servants"
    ]
  },
  "Shravana": {
    sign: "Capricorn",
    careers: [
      "Education and Academia", "Teachers", "Preachers", "Educators in All Fields", "Scholars", "Students", "Linguists", "Language Translators and Interpreters", "Storytellers and Narrators",
      "Entertainment and Media", "Comedians", "Music Business Professionals (Mainly Producers and Sound Technicians)", "Telephone Operators and Phone Job Professionals", "Gossip Columnists", "News Broadcasters", "Talk Show Hosts", "Radio/Television Professionals", "Radio Operators (Including Those Involved in Galactic Signals)",
      "Cultural Preservation and Classical Studies", "Preservation of Ancient Traditions", "Pursuers of Classical Studies",
      "Organizational and Corporate", "Organizational Capacities in Big and Small Corporations",
      "Counseling and Mental Health", "Counselors", "Psychiatrists", "Psychoanalysts", "Psychologists",
      "Travel and Tourism", "Travel Agents", "Transportation Industry Professionals", "Tourism Industry Professionals",
      "Hospitality and Culinary", "Hotel/Restaurant Business Professionals",
      "Medical and Healing", "Higher-Level Healers and Holistic Medicine Practitioners", "Lower-Level Professionals (e.g., Allopathy, Hospitals)", "Medical Profession in General",
      "Charitable and Social Organizations", "Charitable Organization Professionals", "Clubs and Societies Members"
    ]
  },
  "Dhanishta": {
    sign: "Capricorn & Aquarius",
    careers: [
      "Entertainment and Performing Arts", "Musicians", "Dancers", "Performers", "Drummers and Rhythm Section Members", "Makers of Musical Instruments", "Management in the Entertainment Industry", "Military and Marching Band Members",
      "Creative Arts", "Creative Artists of All Types", "Poets", "Songwriters", "Reciters of Rhythmical Incantations",
      "Sports and Athletics", "Athletes", "Sports Persons",
      "Real Estate and Design", "Real Estate Business Professionals", "Landscape Artists",
      "Financial and Business Transactions", "Those Who Deal in Financial Transactions", "Group Coordinators in All Fields",
      "Science and Technology", "Scientists and Physicists", "Computer Professions", "Professions Involving High-Tech Devices and Electronic Equipment",
      "Military and Security", "Warriors and Military People",
      "Mystical and Holistic Practices", "Astrologers", "Divinatory Works", "Psychics and Mediums", "Higher-Level Holistic Healing Practitioners (e.g., Kundalini Yoga)", "Lower-Level Medical Practitioners (e.g., Surgeons)",
      "Jewelry and Precious Metals", "Gemstones and Precious Metal Dealers"
    ]
  },
  "Shatabhisha": {
    sign: "Aquarius",
    careers: [
      "Medical and Pharmaceutical", "Physicians", "Surgeons", "Herbalists", "Drug & Pharmaceutical Industry Professionals",
      "Drug and Alcohol Industry", "Professions Connected with the Production & Distribution of Alcohol", "Drug Dealers", "Drug Pushers",
      "Waste Management", "Waste Disposal Industry Professionals", "Recycling Industry Professionals",
      "Illegal and Unethical Professions", "Pimps", "Prostitutes"
    ]
  },
  "Purva Bhadrapada": {
    sign: "Aquarius & Pisces",
    careers: [
      "Death and Mortuary Professions", "Morticians", "Coffin Makers", "Cemetery Keepers", "Professions Relating to the Death Process",
      "Medical and Pharmaceutical", "Surgeons", "Contemporary Medical Practitioners (Administering Poisons as Remedies)", "Pharmaceutical Industry Professionals",
      "Extremist and Radical Professions", "Fundamentalists", "Radicals", "Fanatics", "Terrorists",
      "Creative Writing and Entertainment", "Horror Writers", "Mystery Writers", "Sci-Fi Writers", "The Dark Side of the Entertainment Industry",
      "Psychological and Psychiatric Professions", "Psychiatrists",
      "Dark and Unethical Professions", "The Dark Side of the Ruling Elite", "Pornographic Industry Professionals", "Weapon Makers and Users", "Occultists Dealing with the Dark Side", "Black Magicians", "Perpetuators of Dark Technologies",
      "Industrial Professions", "Leather Industry Professionals", "Metal Industry Professionals", "Professions Involving the Use of Fire and High Temperatures", "Those Dealing with Toxic Substances and Highly Polluting Waste Products",
      "Activism and Environmentalism", "Environmental Activists",
      "Law Enforcement and Military", "Police Departments (particularly Homicide Squads)", "Soldiers"
    ]
  },
  "Uttara Bhadrapada": {
    sign: "Pisces",
    careers: [
      "Spiritual and Healing Professions", "Yoga and Meditation Experts", "Counselors & Therapists of All Types", "Shamans", "Healers", "Practitioners of Tantra and Other Occult Sciences", "Divination Experts", "Renunciates", "Monks", "Hermits",
      "Charity and Social Work", "Those Working in Charity Organizations",
      "Intellectual and Creative Professions", "Researchers", "Philosophers", "Poets", "Writers", "Musicians", "Artists",
      "Professions Requiring Extraordinary Abilities", "Jobs Requiring Patience, Insight, Erudition, or Awareness",
      "Low Movement and Static Jobs", "Shop Clerks", "Night Watchmen", "Doormen",
      "Historical and Librarian Professions", "Historians", "Librarians",
      "Wealth and Inheritance", "Independently Wealthy Individuals Living Off Inheritances or Legacies", "Those Living Off the Charity of Others"
    ]
  },
  "Revati": {
    sign: "Pisces",
    careers: [
      "Mystical and Entertainment Professions", "Hypnotists & Psychic Mediums", "Creative Artists (e.g., Painters, Musicians)", "Actors", "Entertainers & Comedians", "Conjurors", "Illusionists", "Magicians",
      "Specialized and Technical Professions", "Watchmakers", "Calendar/Ephemeris Makers", "Road Planners", "Rail & Road Construction Professionals", "Time Keepers", "Air Traffic Controllers", "Traffic Cops", "Light House Workers", "Driving Instructors",
      "Gemstone and Marine Industries", "Gemstone Dealers", "Pearl Industry Professionals", "Shipping and Marine Industry Professionals",
      "Transportation and Travel", "Professional Hosts & Hostesses (e.g., Air Hostesses, Ship Stewards)", "Driving or Transport Professions",
      "Religious and Social Institutions", "Those Involved with Religious Institutions", "Foster Homes & Orphanages Workers",
      "Safety and Road Management", "Those Involved with Road Safety"
    ]
  }
};

const BhriguBinduAnalysis = ({ data }) => {
  if (!data?.bhrigu_bindu) return null;

  const bb = data.bhrigu_bindu;
  const nakshatraName = bb.nakshatra_name;
  
  // Find matching data (handling slight name variations)
  const nakshatraKey = Object.keys(BB_NAKSHATRA_DATA).find(k => nakshatraName.includes(k) || k.includes(nakshatraName)) || nakshatraName;
  const bbData = BB_NAKSHATRA_DATA[nakshatraKey];

  return (
    <div className="space-y-6 mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
      <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg">
          🌟
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Bhrigu Bindu (Destiny Point)</h3>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">
            Unlocking Your Ultimate Life Path
          </div>
        </div>
      </div>

      <div className="prose prose-sm text-slate-700">
        <p>
          <strong>What is Bhrigu Bindu?</strong> Bhrigu Bindu, also known as BB or BP (Bhrigu point), signifies a crucial point in one's birth chart that determines their destiny. This point reveals one's ultimate life path, which may differ from their current career path that might not bring them financial and emotional satisfaction. However, upon reaching the activation point of their Bhrigu Bindu, their true destiny unfolds. The universe orchestrates circumstances to guide individuals towards fulfilling their life's purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">BB Position</div>
          <div className="text-lg font-bold text-slate-800">{bb.lon.toFixed(2)}&deg; {bb.sign}</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">BB Nakshatra</div>
          <div className="text-lg font-bold text-slate-800">{nakshatraName}</div>
        </div>
      </div>

      {bbData ? (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Destiny Careers for {nakshatraName} Nakshatra
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bbData.careers.map((career, idx) => (
              <div key={idx} className="bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-700 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">&bull;</span>
                <span>{career}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 rounded-lg text-amber-800 text-sm mt-4">
          Detailed career analysis for {nakshatraName} Nakshatra is currently unavailable.
        </div>
      )}
    </div>
  );
};

export default BhriguBinduAnalysis;
