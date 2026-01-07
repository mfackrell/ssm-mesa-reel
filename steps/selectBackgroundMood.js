export async function selectBackgroundMood() {
  console.log("Selecting background mood...");

  const moods = {
    1: "Sunset light catching the edge of a quiet porch chair OR soft shadows on a wooden deck at golden hour OR cozy kitchen corner with warm tones and visible dusk through the window",
    2: "Overcast shoreline OR calm ocean edge OR coastal waterline",
    3: "Early morning exterior OR cool dawn light outdoors OR still outdoor space at first light",
    4: "First light on empty street with long shadows OR quiet neighborhood sidewalk after rain OR still trees under pale dawn sky",
    5: "beach path with dune grass moving gently in wind OR low-contrast color field OR restrained abstract texture",
    6: "Residential hallway with lived-in feel (shoes, coat, stray light) OR stairwell with natural light through window OR neutral corridor with signs of life (coat rack, light switch)",
    7: "Still landscape OR distant horizon OR flat natural terrain",
    8: "Lamplight in a quiet bedroom corner OR soft-glow nightstand with open journal OR low-lit room with faint streetlight through blinds",
    9: "Subtle environmental motion OR slow-moving water surface OR gentle fabric movement",
    0: "Field with slow wind through tall grass OR quiet hiking path under tree canopy OR open natural space with still sky and no people"
  };

  // Logic: Randomly select a key from 0 to 9
  const keys = Object.keys(moods);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const selectedMood = moods[randomKey];

  console.log(`Mood Selected [${randomKey}]: "${selectedMood}"`);

  return selectedMood;
}
