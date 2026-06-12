// Centralized paths to the visual assets used by the float generator.
//
// These are public URL paths — the actual files live under
// `public/assets/float/` so they are served from the site root at
// runtime.
//
// Post-pivot status (the app no longer post-processes ChatGPT's
// output — ChatGPT produces the complete parade float concept image
// directly using the wheels-on-template structural reference):
//   - LIVE in the ChatGPT input pack ZIP:
//       templateWithWheels, styleReference
//     (these paths are also hard-coded in `src/lib/buildInputPack.js`
//      because the pack is a fixed user-facing contract; this config
//      is the documentation source of truth.)
//   - DORMANT (kept on disk as historical/reference assets):
//       templateGeneration, wheelOverlay, designZoneMask,
//       rearRightSignMask
//     None of these are referenced by app code anymore. The PNGs stay
//     under `public/assets/float/` so they're available if a future
//     pivot brings them back.

export const FLOAT_ASSET_PATHS = {
  templateGeneration: '/assets/float/float_template_generation.png',
  templateWithWheels: '/assets/float/float_template_with_wheels.png',
  wheelOverlay: '/assets/float/float_wheel_overlay.png',
  designZoneMask: '/assets/float/float_design_zone_mask.png',
  rearRightSignMask: '/assets/float/rear_right_sign_zone_mask.png',
  styleReference: '/assets/float/float_style_reference.png',
}

// Optional metadata describing how each asset is used. Useful for
// onboarding new contributors and as a stable record of which file
// plays which role downstream.
export const FLOAT_ASSETS = {
  templateGeneration: {
    path: FLOAT_ASSET_PATHS.templateGeneration,
    role: 'Wheel-less base float template. Dormant in-app; kept on disk as a reference asset.',
  },
  templateWithWheels: {
    path: FLOAT_ASSET_PATHS.templateWithWheels,
    role: 'Float template shown with wheels — shipped in the ChatGPT input pack as the structural reference for ChatGPT.',
  },
  wheelOverlay: {
    path: FLOAT_ASSET_PATHS.wheelOverlay,
    role: 'Transparent wheels overlay. Dormant in-app; kept on disk as a reference asset.',
  },
  designZoneMask: {
    path: FLOAT_ASSET_PATHS.designZoneMask,
    role: 'Editable design surface mask. Dormant in-app; kept on disk as a reference asset.',
  },
  rearRightSignMask: {
    path: FLOAT_ASSET_PATHS.rearRightSignMask,
    role: 'Rear-right sign zone mask. Dormant in-app; kept on disk as a reference asset.',
  },
  styleReference: {
    path: FLOAT_ASSET_PATHS.styleReference,
    role: 'Style reference image, shipped in the ChatGPT input pack to guide visual direction.',
  },
}

export default FLOAT_ASSETS
