export async function selectBackgroundMood() {
  console.log("Selecting background mood...");

  const moods = [
    "Sunset light catching the edge of a quiet porch chair",
    "Soft shadows on a wooden deck at golden hour",
    "Cozy kitchen corner with warm tones and visible dusk through the window",
    "Overcast shoreline with flat grey water",
    "Calm ocean edge with small, rhythmic ripples",
    "Coastal waterline with white sea foam on dark sand",
    "Early morning exterior with cool dawn light on a garden",
    "Still outdoor patio at first light with blue hour tones",
    "Empty residential street at dawn with long, soft shadows",
    "Quiet neighborhood sidewalk with wet pavement after rain",
    "Still trees under a pale, hazy dawn sky",
    "Beach path with dune grass moving gently in the wind",
    "Macro view of ripples expanding in a dark stone basin", 
    "Shadows of palm fronds swaying slowly on a warm terracotta wall", 
    "A single wild poppy nodding gently in a blurred grassy field", 
    "Close-up of a fountain pen resting on a page", 
    "Out-of-focus candlelight reflecting off the surface of dark coffee",
    "Distant mountain horizon under a flat, gray sky",
    "Flat natural terrain of a dry field at twilight",
    "Lamplight in a quiet bedroom corner with warm amber tones",
    "Soft-glow nightstand with an open, blank journal",
    "Low-lit room with faint streetlight through closed blinds",
    "Slow-moving water surface in a stone fountain",
    "Field with slow wind through tall, golden grass",
    "Quiet hiking path under a dense green tree canopy",
    "Open natural meadow with a still, cloudless sky",
    "raindrops running down a window pane",
    "Soft focus on a steaming cup of tea on a rustic table",
    "Winter morning light hitting a frosted fence line",
    "Quiet library corner with dust motes dancing in a sunbeam",
    "Empty park bench under a large, still oak tree",
    "Macro shot of a green leaf with morning dew",
    "Subtle ripples in a dark, forest pond",
    "Shadow of tree branches moving on a white plaster wall",
    "Old wooden door with peeling paint in soft daylight",
    "Stacked ceramic plates in a quiet, sunlit pantry",
    "A single candle flame flickering in a dim, still room",
    "Distant city lights blurred in a deep blue twilight",
    "The texture of a weathered stone wall in the shade",
    "A winding gravel path disappearing into soft fog",
    "Pampas grass swaying against a neutral beige wall",
    "Soft light hitting the spine of old books on a shelf",
    "Reflections of clouds in a still rainwater puddle",
    "A lone pine tree standing against a misty hillside",
    "Warm sunlight through a glass of water on a table",
    "The rhythmic sway of a hanging porch fern",
    "A quiet balcony overlooking a sleeping neighborhood"
  ];

  // Logic: Randomly select one item from the array
  const randomIndex = Math.floor(Math.random() * moods.length);
  const selectedMood = moods[randomIndex];

  console.log(`Mood Selected: "${selectedMood}"`);

  return selectedMood;
}
