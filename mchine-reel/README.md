# MCHINE — 25s Instagram Reel

A 1080×1920 / 30fps brand ad for MCHINE, built with [Remotion](https://www.remotion.dev).
The finished video is in [`renders/`](renders/).

## Story (25s, cut on a 120 BPM grid)

| Time | Scene | Narration |
| --- | --- | --- |
| 0–4s | **Hook**: a stopwatch counts 3‑2‑1‑0 | "You have three seconds. That's all a visitor gives your website." |
| 4–6s | **Waste**: a dated site glitches, collapses, CRT switch‑off | "Most websites waste them." |
| 6–9s | **Logo**: "MACHINE" is stamped, the A is punched out → MCHINE | "Meet MCHINE." |
| 9–12.5s | **Build**: a site assembles in a phone, wireframe first | "We design and build websites that work as hard as you do." |
| 12.5–15.5s | **Pillars**: design / code / speed | "Sharp design. Clean code. Built for speed." |
| 15.5–18s | **Convert**: fast scroll, tap, notifications | "Made to turn scrollers into customers." |
| 18–21s | **Rebuilt**: palette flip, letters machine‑assembled | "Your business, rebuilt." |
| 21–25s | **CTA**: wordmark, shine, "Link in bio" | "MCHINE. Let's build yours." |

## Editing

- On-screen copy is passed as props in `src/MchineReel.tsx` (each scene is also its own
  composition under **Scenes** in the Studio).
- Narration text, voice start frames and every sound-effect cue live in `src/timeline.json`.
- Brand colours and fonts are in `src/theme.ts` (Archivo Expanded + JetBrains Mono, served locally from `public/fonts`).
- The MCHINE wordmark is typographic. Swap in a logo file in `src/scenes/Logo.tsx` and `src/scenes/Cta.tsx` if you have one.

## Rebuilding the audio

All audio is generated locally; nothing is licensed or sampled.

```console
# Narration: Kokoro-82M open-source TTS (voice af_heart).
pip install kokoro-onnx soundfile numpy scipy
# model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
python3 scripts/tts.py <dir-with-kokoro-v1.0.onnx-and-voices-v1.0.bin> af_heart 1.05

# Music bed + sound effects, synthesized and ducked under the voice using src/timeline.json
python3 scripts/audio.py
```

## Preview and render

```console
npm i
npm run dev            # Remotion Studio
npm run render         # out/mchine-reel.mp4
npm run master         # loudness-normalise to -14 LUFS for Instagram -> renders/
```
