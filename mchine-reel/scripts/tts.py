"""Generate narration phrases with Kokoro (open-source TTS) and report durations.

Usage: python3 scripts/tts.py <kokoro-model-dir> <voice> <speed>
Writes public/vo/<id>.wav for every phrase and public/vo/durations.json.
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

# id, text spoken by the TTS (phonetic where needed)
PHRASES = [
    ("p01", "You have three seconds."),
    ("p02", "That's all a visitor gives your website."),
    ("p03", "Most websites waste them."),
    ("p04", "Meet Machine."),
    ("p05", "We design and build websites that work as hard as you do."),
    ("p06", "Sharp design."),
    ("p07", "Clean code."),
    ("p08", "Built for speed."),
    ("p09", "Made to turn scrollers into customers."),
    ("p10", "Your business, rebuilt."),
    ("p11", "Machine. Let's build yours."),
]

model_dir, voice, speed = sys.argv[1], sys.argv[2], float(sys.argv[3])
out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "vo")
os.makedirs(out_dir, exist_ok=True)

kokoro = Kokoro(
    os.path.join(model_dir, "kokoro-v1.0.onnx"),
    os.path.join(model_dir, "voices-v1.0.bin"),
)

durations = {}
for pid, text in PHRASES:
    samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
    # trim leading/trailing silence so phrases can be placed tightly
    thresh = 0.01 * np.max(np.abs(samples))
    idx = np.where(np.abs(samples) > thresh)[0]
    start = max(0, idx[0] - int(0.02 * sr))
    end = min(len(samples), idx[-1] + int(0.06 * sr))
    samples = samples[start:end]
    # even out levels between phrases: peak-normalise to -1 dBFS
    samples = samples / np.max(np.abs(samples)) * 10 ** (-1 / 20)
    sf.write(os.path.join(out_dir, f"{pid}.wav"), samples, sr)
    durations[pid] = round(len(samples) / sr, 3)
    print(pid, durations[pid], text)

with open(os.path.join(out_dir, "durations.json"), "w") as f:
    json.dump({"voice": voice, "speed": speed, "durations": durations}, f, indent=2)
print("total speech", round(sum(durations.values()), 2))
