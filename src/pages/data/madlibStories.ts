/**
 * Configurable Mad Libs story types and templates.
 * Templates use Handlebars syntax: {{key}} is replaced with the form value for that key.
 */

export interface MadlibStoryType {
  value: string;
  label: string;
  template: string;
}

/** Human-readable label for each form field key. */
export const MADLIB_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  noun: "Noun",
  verb: "Verb",
  adjective: "Adjective",
  adverb: "Adverb",
  animal: "Animal",
  place: "Place",
  food: "Food",
  number: "Number",
  color: "Color",
  occupation: "Occupation"
};

/**
 * Story types: add or edit entries to change the dropdown and story content.
 * Use {{fieldKey}} in the template; fieldKey must exist in MADLIB_FIELD_LABELS.
 */
export const MADLIB_STORY_TYPES: MadlibStoryType[] = [
  {
    value: "dragon",
    label: "Dragon Legend",
    template: `In the ancient kingdom of {{place}}, there lived a {{adjective}} {{occupation}} named {{name}}. For many years, the people feared a {{color}} dragon that slept beneath the mountains beyond {{place}}. The creature guarded a mysterious {{adjective}} {{noun}} said to grant unimaginable power.

One day, after hearing the dragon roar {{adverb}} across the sky, {{name}} decided to {{verb}} toward the mountain alone. Along the path, a wise {{animal}} appeared and warned, "Only those who are truly {{adjective}} may survive what lies ahead."

Ignoring fear, {{name}} climbed for {{number}} days and {{number}} nights. The air grew thick with smoke the color of {{color}}, and the ground trembled with every breath the dragon took. At last, {{name}} reached the cavern, where piles of {{noun}}s and remnants of {{food}} were scattered across the floor.

The dragon opened its glowing {{color}} eyes and spoke: "Why does a {{occupation}} dare to {{verb}} into my domain?"

With a voice shaking but determined, {{name}} answered {{adverb}}, explaining their quest to protect {{place}} from destruction. The dragon studied {{name}} carefully, then unleashed a storm of fire hotter than boiling {{food}}.

Thinking quickly, {{name}} chose to {{verb}} with courage rather than attack. The dragon, surprised by such {{adjective}} resolve, revealed the truth: it had long protected the realm from an even greater danger.

Recognizing this, {{name}} pledged to guard the sacred {{noun}} alongside the dragon. From that day forward, the people of {{place}} told stories of the {{adjective}} hero {{name}}, who dared to {{verb}} where none else would — and who proved that true strength is found in {{adjective}} hearts.`
  },
  {
    value: "princess",
    label: "Princess Destiny",
    template: `In the shining realm of {{place}}, there lived a {{adjective}} princess named {{name}}. Though born into royalty, she dreamed of becoming a {{occupation}} and traveling beyond the castle walls.

Every morning, she would {{verb}} {{adverb}} through the palace gardens, followed by her loyal {{animal}} companion. The kingdom prospered with fields of {{adjective}} {{noun}} and festivals celebrating mountains of {{food}}.

But peace did not last. One evening, the sky turned {{color}}, and a dark messenger arrived carrying a warning: a powerful force threatened to conquer {{place}} unless someone brave enough could retrieve the legendary {{adjective}} {{noun}} hidden deep within forbidden lands.

Determined to save her people, {{name}} disguised herself as a {{occupation}} and began her journey. She traveled for {{number}} days across forests filled with whispering {{animal}}s and rivers that shimmered {{adverb}} under moonlight.

Along the way, she faced trials of courage, wisdom, and compassion. She chose to {{verb}} when others would flee, to share her last {{food}} with strangers, and to act with {{adjective}} grace even in danger.

At last, she reached a towering gate guarded by a {{color}} {{animal}} who demanded proof of her worth. Instead of fighting, {{name}} spoke {{adverb}} about her love for {{place}} and her hope for peace.

Moved by her sincerity, the guardian granted passage. Inside, she found the sacred {{noun}}, glowing brighter than any treasure.

When {{name}} returned home, the kingdom celebrated for {{number}} days. She was no longer known only as a princess, but as a {{adjective}} leader who chose destiny through courage rather than birthright.`
  },
  {
    value: "pirate",
    label: "Pirate Adventure",
    template: `Across the endless waters near {{place}} sailed the infamous pirate {{name}}, once a humble {{occupation}} who chose a life of adventure. Commanding a crew as {{adjective}} as the storms they chased, {{name}} sought the legendary {{color}} {{noun}} said to control the tides themselves.

The voyage was perilous. Waves crashed {{adverb}} against the ship, and enormous {{animal}}s surfaced from the depths to block their path. Yet the crew pressed on, surviving on barrels of {{food}} and sheer determination for {{number}} relentless days.

According to ancient charts, the treasure lay hidden on an island where the sand shimmered {{color}} and the wind whispered warnings to those who dared {{verb}} ashore.

Upon landing, {{name}} discovered ruins of a forgotten civilization built from {{adjective}} stone. Symbols of {{animal}}s and swirling {{noun}}s covered every surface. At the center stood a massive gate that would open only for one who could {{verb}} with {{adjective}} intent.

When rival hunters arrived led by a ruthless {{occupation}}, a fierce confrontation began. The air filled with shouts, crashing {{noun}}s, and the scent of spilled {{food}}.

Choosing wisdom over greed, {{name}} activated the artifact not for power, but to calm the raging sea threatening {{place}}. The waters grew still, the storms faded, and the treasure revealed its true purpose — protection, not conquest.

From that day forward, sailors spoke of the {{adjective}} pirate {{name}}, who sailed not for riches, but to {{verb}} where danger rose and ensure the oceans remained free for all who dared adventure.`
  }
];

/** Extract all {{key}} placeholders from a template string. */
function getTemplateKeys(template: string): string[] {
  const re = /\{\{(\w+)\}\}/g;
  const keys: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) {
    if (!keys.includes(m[1])) keys.push(m[1]);
  }
  return keys;
}

/** All unique field keys used across all story templates, in a stable order. */
const ALL_KEYS = [
  "name",
  "noun",
  "verb",
  "adjective",
  "adverb",
  "animal",
  "place",
  "food",
  "number",
  "color",
  "occupation"
];

/** Keys that appear in at least one template. */
export function getMadlibFormKeys(): string[] {
  const used = new Set<string>();
  for (const story of MADLIB_STORY_TYPES) {
    for (const key of getTemplateKeys(story.template)) {
      used.add(key);
    }
  }
  return ALL_KEYS.filter((k) => used.has(k));
}
