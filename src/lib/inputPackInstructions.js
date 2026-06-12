// Instructions bundled inside every ChatGPT input-pack ZIP. Kept as a
// plain default-exported string so `buildInputPack` can slot it straight
// into the archive without any string templating. If the surrounding
// pack contract changes (filenames, steps), update this text first —
// it's the user-facing copy of what the pack contains.

const INSTRUCTIONS_TEXT = `Pride Float Generator — How to use these files

This ZIP gives ChatGPT everything it needs to generate a complete
Pride parade float concept image, using the attached template as the
structural base.

Files included
- prompt.txt — paste into ChatGPT
- instructions.txt — this file
- float_template_with_wheels.png — base float template (use as the structural reference)
- float_style_reference.png — style guidance for tone, color, and decorative vocabulary

Steps
1. Open ChatGPT (an image-capable model, e.g. GPT-4o).
2. Upload float_template_with_wheels.png and float_style_reference.png to the chat.
3. Paste the contents of prompt.txt.
4. Let ChatGPT generate a complete parade float concept image.
5. Download the generated image.
6. Send your completed float concept to Sarah Laue and Abby Gregory in Slack along with your department or team name.

Reminders
- The float should preserve the template's shape, proportions, perspective, and wheels.
- The output is a complete float concept — not a transparent decoration layer.
- No people, no readable text, no logos, no alcohol/drugs/nudity.
- Family-friendly, inclusive, workplace-appropriate.
`

export default INSTRUCTIONS_TEXT
