export async function selectTextBehavior() {
  console.log("Selecting text behavior...");

  const textBehaviors = {
    1: "Text appears character-by-character with a blinking cursor OR Text scribbles on screen in a fast, messy handwriting style",
    2: "Text is highlighted aggressively with a yellow marker animation OR Text is circled rapidly like a mistake",
    3: "Text appears in a typewriter font with a mechanical stamp sound OR Text looks like a label from a label-maker stuck onto the video",
    4: "Text is struck through with a single pen line OR Text is scribbled out completely with black marker then rewritten",
    5: "Text mimics an incoming iMessage bubble popping up OR Text appears on a torn piece of paper graphic taped to the screen",
    6: "Text jitters nervously in place like a glitch OR Text shakes subtly like a hand holding a pen",
    7: "Text flashes stark white like a subliminal warning OR Text flows onto the screen like spreading ink",
    8: "Text is redacted (black bars) then revealed OR Text appears faint like pencil and then darkens to bold",
    9: "Text cuts in sharply on the beat of the audio OR Text slams onto the screen with a paper-crumpling sound effect",
    0: "Text blurs into sharp focus instantly OR Text dissolves into sand/dust and reforms"
  };

  // Logic: Randomly select a key from 0 to 9
  const keys = Object.keys(textBehaviors);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const selectedBehavior = textBehaviors[randomKey];

  console.log(`Text Behavior Selected [${randomKey}]: "${selectedBehavior}"`);

  return selectedBehavior;
}
