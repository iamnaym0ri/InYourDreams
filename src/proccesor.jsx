export function getEngineForPrompt(prompt) {
    console.log("triggered")
  const lowered = prompt.toLowerCase();
  
  const nsfwKeywords = [
  "nude", "nsfw", "sex", "explicit", "erotic", "sexy", "ass", "boobs", "baddie", "tits", "naked", "bare", "topless",
  "busty", "sensual", "hot", "provocative", "intimate", "lewd", "fetish", "thong", "lingerie", "panties",
  "cleavage", "orgasm", "aroused", "lust", "desire", "wet", "cum", "cock", "dick", "vagina", "pussy",
  "penetration", "blowjob", "handjob", "anal", "doggy", "missionary", "69", "spank", "whip", "bdsm",
  "dominatrix", "submissive", "dom", "strip", "sexually", "seduce", "nipple", "horny", "moan", "suck",
  "lick", "deepthroat", "cumshot", "ejaculation", "fingering", "gagging", "thrusting", "humping",
  "nudes", "camgirl", "onlyfans", "milf", "teen", "babes", "naughty", "flashing", "tight", "wetness",
  "sex toy", "dildo", "vibrator", "masturbate", "jerk", "stripper", "escort", "porn", "porno", "xxx",
  "bdsm", "latex", "kinky", "hardcore", "softcore", "fap", "slut", "hooker", "seduction", "cameltoe",
  "crotch", "butt", "g-string", "skimp", "cuck", "pegging", "clit", "fleshlight", "naughty", "tease",
  "gag", "spreader", "nipple clamp", "pov", "facial", "bukkake", "cream", "creampie", "ahegao", "cameltoe"
];

const animeKeywords = [
  "anime", "manga", "waifu", "husbando", "aesthetic", "kawaii", "otaku", "tsundere", "yandere",
  "isekai", "shonen", "shojo", "neko", "catgirl", "kemonomimi", "anime girl", "anime boy",
  "chibi", "cosplay", "cosplayer", "anime style", "anime character", "anime art", "manga panel",
  "japan", "japanese", "vocaloid", "hatsune", "miku", "anime eyes", "anime hair", "big eyes",
  "anime aesthetic", "sailor", "sailor moon", "dragon ball", "naruto", "bleach", "one piece",
  "my hero", "attack on titan", "demon slayer", "tokyo ghoul", "jujutsu kaisen", "spy x family",
  "anime schoolgirl", "uniform", "maid", "anime maid", "anime fight", "anime background",
  "anime couple", "romance anime", "slice of life", "anime fantasy", "anime magic",
  "anime sword", "anime demon", "anime angel", "anime fox", "anime ears", "anime tail",
  "anime armor", "anime kimono", "anime outfit", "anime fashion", "anime scene",
  "anime world", "anime sky", "anime landscape", "anime background", "anime style art",
  "anime digital", "mangaka", "anime light", "anime vibe", "anime mood", "anime drawing",
  "anime girl cute", "anime boy cool", "bishojo", "bishonen", "anime school", "anime love",
  "anime crying", "anime happy", "anime expression", "anime transformation", "magical girl",
  "anime powers", "anime ninja", "anime samurai", "anime knight", "anime monster", "anime mecha",
  "gundam", "evangelion", "anime mask", "anime villain", "anime hero", "anime student",
  "anime club", "anime sword girl", "anime armor", "anime wings", "anime glow"
];

  const isNSFW = nsfwKeywords.some(word => lowered.includes(word));
  const isAnime = animeKeywords.some(word => lowered.includes(word));

  if (isNSFW && isAnime) return "illustrious"; 
  if (isNSFW) return "pony";
  if (isAnime) return "illustrious";

  return "sdxl";
}
