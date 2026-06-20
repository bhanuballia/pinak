export const syllableToDevanagari = {
    // Nakshatra Syllables
    "chu": "चू", "che": "चे", "cho": "चो", "laa": "ला", "la": "ला",
    "lee": "ली", "li": "ली", "loo": "लू", "lu": "लू", "le": "ले", "lo": "लो",
    "a": "अ", "ee": "ई", "i": "इ", "u": "उ", "e": "ए",
    "o": "ओ", "vaa": "वा", "va": "वा", "vee": "वी", "vi": "वी", "vu": "वू", "ve": "वे", "vo": "वो",
    "kaa": "का", "ka": "क", "kee": "की", "ki": "कि", "ku": "कु", "koo": "कू", "gha": "घ", "ing": "ङ", "ng": "ङ", "chha": "छ",
    "ke": "के", "ko": "को", "haa": "हा", "ha": "ह", "hee": "ही", "hi": "हि", "hu": "हु", "he": "हे", "ho": "हो",
    "daa": "डा", "da": "ड", "dee": "डी", "di": "डि", "doo": "डू", "du": "डु", "de": "डे", "do": "डो",
    "maa": "मा", "ma": "म", "mee": "मी", "mi": "मि", "moo": "मू", "mu": "मु", "me": "मे", "mo": "मो",
    "taa": "टा", "ta": "ट", "tee": "टी", "ti": "टि", "too": "टू", "tu": "टु", "te": "टे", "to": "टो",
    "paa": "पा", "pa": "प", "pee": "पी", "pi": "पि", "poo": "पू", "pu": "पु", "sha": "श", "na": "न", "tha": "थ",
    "pe": "पे", "po": "पो", "raa": "रा", "ra": "र", "ree": "री", "ri": "रि", "roo": "रू", "ru": "रु", "re": "रे", "ro": "रो",
    "naa": "ना", "nee": "नी", "noo": "नू", "ne": "ने", "no": "नो",
    "yaa": "या", "ya": "य", "yee": "यी", "yi": "यि", "yoo": "यू", "yu": "यु", "ye": "ये", "yo": "यो",
    "bhaa": "भा", "bha": "भ", "bhee": "भी", "bhi": "भि", "bhoo": "भू", "bhu": "भु", "dhaa": "धा", "dha": "ध",
    "phaa": "फा", "pha": "फ", "bhe": "भे", "bho": "भो", "jaa": "जा", "ja": "ज", "jee": "जी", "ji": "जि",
    "khee": "खी", "khi": "खि", "khoo": "खू", "khu": "खु", "khe": "खे", "kho": "खो",
    "gaa": "गा", "ga": "ग", "gee": "गी", "gi": "गि", "gu": "गु", "ge": "गे", "go": "गो",
    "saa": "सा", "sa": "स", "see": "सी", "si": "सि", "soo": "सू", "su": "सु", "se": "से", "so": "सो",
    "jha": "झ", "nya": "ञ", "chaa": "चा", "cha": "च", "chee": "ची", "chi": "चि",

    // Swar Siddhanta additional
    "aa": "आ", "kha": "ख", "ii": "ई", "ba": "ब", "ai": "ऐ", "the": "थे", "ou": "औ",
    "am": "अं", "ah": "अः", "ghe": "घे"
};

export const translateSyllable = (syllable) => {
    if (!syllable) return "";
    const lowerSyllable = syllable.trim().toLowerCase();
    return syllableToDevanagari[lowerSyllable] || syllable;
};
