#!/usr/bin/env bash
# Loudness-normalise the rendered reel for Instagram (-14 LUFS integrated, -1 dBTP)
# and write the deliverable to renders/. Video stream is copied untouched.
set -euo pipefail
cd "$(dirname "$0")/.."
in=${1:-out/mchine-reel.mp4}
out=${2:-renders/MCHINE-reel-25s.mp4}
mkdir -p "$(dirname "$out")"
ffmpeg -y -hide_banner -loglevel error -i "$in" \
  -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a aac -b:a 320k \
  -t 25 -movflags +faststart "$out"
echo "wrote $out"
