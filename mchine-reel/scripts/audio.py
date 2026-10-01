"""Synthesize the original music bed and sound effects for the MCHINE reel.

Everything is generated from scratch with numpy (no samples, no licensing).
Cue points come from src/timeline.json so audio and picture share one timeline.

Usage: python3 scripts/audio.py
Writes public/audio/music.wav (ducked under the voiceover) and public/audio/sfx.wav.
"""
import json
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
ROOT = os.path.join(os.path.dirname(__file__), "..")
TL = json.load(open(os.path.join(ROOT, "src", "timeline.json")))
FPS = TL["fps"]
BEAT = 60 / TL["bpm"]
LENGTH = TL["durationInFrames"] / FPS + 0.0
N = int(LENGTH * SR)
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "lowpass", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "highpass", fs=SR, output="sos"), x)


def noise(dur):
    return rng.uniform(-1, 1, int(dur * SR))


def env_exp(dur, decay):
    return np.exp(-t_arr(dur) / decay)


def place(buf, sig, at, gain=1.0, pan=0.0):
    """Add mono or stereo sig into stereo buf at time `at` seconds."""
    i = int(at * SR)
    if i >= len(buf):
        return
    if sig.ndim == 1:
        lg = np.cos((pan + 1) * np.pi / 4)
        rg = np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * lg * 1.414, sig * rg * 1.414], axis=1)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def saw(freq, t, voices=3, detune=0.12):
    out = np.zeros_like(t)
    for v in range(voices):
        f = freq * 2 ** ((v - (voices - 1) / 2) * detune / 12)
        ph = rng.uniform(0, 1)
        out += 2 * ((t * f + ph) % 1) - 1
    return out / voices


def note(n):
    """MIDI note number to Hz."""
    return 440 * 2 ** ((n - 69) / 12)


def reverb_ir(dur=1.6, decay=0.45, stereo=True):
    t = t_arr(dur)
    left = noise(dur) * np.exp(-t / decay)
    right = noise(dur) * np.exp(-t / decay)
    left, right = lp(left, 6000), lp(right, 6000)
    ir = np.stack([left, right], axis=1)
    return ir / np.sqrt(np.sum(ir ** 2))


IR = reverb_ir()


def reverb(buf, wet=0.25):
    out = np.zeros_like(buf)
    mono = buf.mean(axis=1)
    for c in range(2):
        out[:, c] = fftconvolve(mono, IR[:, c])[: len(buf)]
    return buf + out * wet


# ---------------------------------------------------------------- instruments
def kick(punch=1.0):
    d = 0.45
    t = t_arr(d)
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(d, 0.16)
    click = hp(noise(0.006), 2000) * 0.4
    body[: len(click)] += click
    return np.tanh(body * 1.6 * punch)


def clap():
    d = 0.3
    out = np.zeros(int(d * SR))
    for k, off in enumerate([0, 0.011, 0.022]):
        n = bp(noise(0.25), 900, 3200) * env_exp(0.25, 0.05 if k == 2 else 0.012)
        i = int(off * SR)
        out[i : i + len(n)] += n[: len(out) - i]
    return out * 0.9


def hat(open_=False):
    d = 0.25 if open_ else 0.05
    return hp(noise(d), 7500, 4) * env_exp(d, 0.07 if open_ else 0.012)


def sub(freq, dur):
    t = t_arr(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    a = np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.03)
    return s * a


def pad(freqs, dur, cutoff=1400, attack=0.4):
    t = t_arr(dur)
    s = sum(saw(f, t, 3, 0.18) for f in freqs) / len(freqs)
    s = lp(s, cutoff, 2)
    a = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / 0.4)
    return s * a


def pluck(freq, dur=0.22):
    t = t_arr(dur)
    s = saw(freq, t, 2, 0.08)
    # crude filter envelope: blend bright and dark versions
    bright, dark = lp(s, 5000), lp(s, 600)
    e = np.exp(-t / 0.05)
    return (bright * e + dark * (1 - e)) * env_exp(dur, 0.09)


# ---------------------------------------------------------------- sfx
def sfx_tick(final=False):
    d = 0.12
    t = t_arr(d)
    f = 1800 if not final else 1200
    s = np.sin(2 * np.pi * f * t) * env_exp(d, 0.012)
    wood = bp(noise(d), 600, 1800) * env_exp(d, 0.02) * 0.6
    low = np.sin(2 * np.pi * 70 * t) * env_exp(d, 0.06) * (0.9 if final else 0.5)
    return (s + wood + low) * 0.8


def sfx_glitch():
    d = 0.16
    t = t_arr(d)
    sq = np.sign(np.sin(2 * np.pi * rng.uniform(180, 900) * t))
    gate = (np.floor(t * rng.uniform(40, 90)) % 2).astype(float)
    crush = np.round(noise(d) * 4) / 4
    s = (sq * 0.5 + crush * 0.5) * gate
    return hp(s, 150) * env_exp(d, 0.08) * 0.55


def sfx_power_down():
    d = 0.5
    t = t_arr(d)
    f = 2400 * np.exp(-t / 0.08) + 40
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, 0.18)
    return s * 0.5 + hp(noise(d), 3000) * env_exp(d, 0.03) * 0.25


def sfx_riser(dur):
    t = t_arr(dur)
    n = noise(dur)
    out = np.zeros_like(n)
    seg = int(0.02 * SR)
    for i in range(0, len(n), seg):
        x = i / len(n)
        lo = 200 + 5000 * x ** 2
        out[i : i + seg] = bp(n[max(0, i - 2000) : i + seg], lo, lo * 2.2)[-len(out[i : i + seg]):]
    tone = np.sin(2 * np.pi * np.cumsum(110 + 660 * (t / dur) ** 2) / SR) * 0.25
    return (out + tone) * (t / dur) ** 2 * 0.7


def sfx_impact(soft=False):
    d = 2.2
    t = t_arr(d)
    f = 30 + 60 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, 0.5 if not soft else 0.25)
    crack = bp(noise(d), 200, 6000) * env_exp(d, 0.06)
    s = np.tanh(boom * 1.8) * 0.9 + crack * (0.6 if not soft else 0.3)
    return s * (1.0 if not soft else 0.7)


def sfx_stamp(i):
    d = 0.35
    t = t_arr(d)
    base = 180 + 22 * i
    metal = sum(
        np.sin(2 * np.pi * base * r * t) * env_exp(d, 0.09 / (k + 1))
        for k, r in enumerate([1, 2.76, 5.4, 8.93])
    )
    thud = np.sin(2 * np.pi * np.cumsum(50 + 80 * np.exp(-t / 0.02)) / SR) * env_exp(d, 0.07)
    return (metal * 0.25 + thud * 0.8) * 0.8


def sfx_whoosh(dur=0.45, up=True):
    t = t_arr(dur)
    n = noise(dur)
    out = np.zeros_like(n)
    seg = int(0.01 * SR)
    for i in range(0, len(n), seg):
        x = i / len(n)
        c = 300 + 3500 * (x if up else 1 - x)
        out[i : i + seg] = bp(n[max(0, i - 1500) : i + seg], c * 0.6, c * 1.6)[-len(out[i : i + seg]):]
    bell = np.sin(np.pi * t / dur) ** 2
    return out * bell * 0.9


def sfx_pop(i=0):
    d = 0.09
    t = t_arr(d)
    f = (700 + 60 * (i % 5)) * np.exp(-t / 0.03) + 220
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, 0.03) * 0.5


def sfx_type():
    d = 0.03
    return bp(noise(d), 2000, 7000) * env_exp(d, 0.006) * 0.5


def sfx_tap():
    d = 0.08
    t = t_arr(d)
    return (np.sin(2 * np.pi * 320 * t) * env_exp(d, 0.015) + bp(noise(d), 1500, 5000) * env_exp(d, 0.005)) * 0.6


def sfx_ding(i=0):
    d = 0.8
    t = t_arr(d)
    f0 = [1318.5, 1568, 1975.5][i % 3]
    s = sum(np.sin(2 * np.pi * f0 * m * t) * env_exp(d, 0.3 / m) / m for m in [1, 2, 3.01])
    return s * 0.28


def sfx_reverse_swell(dur):
    t = t_arr(dur)
    s = pad([note(57), note(64), note(69), note(72)], dur, 3000, 0.01)
    cym = hp(noise(dur), 5000) * 0.5
    return (s * 0.7 + cym) * (t / dur) ** 3 * 0.8


def sfx_shine():
    d = 0.7
    t = t_arr(d)
    f = 2000 + 4000 * t / d
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2
    return s * 0.12 + hp(noise(d), 8000) * np.sin(np.pi * t / d) ** 2 * 0.15


def sfx_stinger():
    d = 2.0
    chord = pad([note(45), note(57), note(64), note(69), note(72)], d, 2500, 0.005)
    return chord * env_exp(d, 0.6) * 1.2 + sfx_impact(True)[: int(d * SR)] * 0.5


# ---------------------------------------------------------------- music
def build_music():
    m = np.zeros((N, 2))

    def beats(start, end, step=BEAT):
        return np.arange(start, end - 1e-6, step)

    # Intro 0-4s: tense sub drone + heartbeat kick on the countdown
    place(m, pad([note(33), note(45), note(52)], 4.2, 450, 0.6) * 1.1, 0)
    place(m, sub(note(33), 4.0) * 0.35, 0)
    for b in [0, 1, 2, 3]:
        place(m, kick(0.8), b, 0.7)
    for b in beats(0.25, 4, BEAT / 2):
        place(m, hat(), b, 0.12, pan=0.3)

    # Glitch 4-5.6s: stuttered groove that tape-stops
    glitch = np.zeros((int(1.8 * SR), 2))
    for b in beats(0, 1.6, BEAT / 2):
        place(glitch, kick(), b, 0.8)
        place(glitch, hat(True), b + BEAT / 4, 0.18)
    place(glitch, sub(note(33), 1.6) * 0.5, 0)
    place(glitch, pad([note(57), note(60), note(64)], 1.6, 2000, 0.02) * 0.35, 0)
    # tape stop: playback rate falls to zero over the last 0.7s
    rate = np.ones(len(glitch))
    s0 = int(0.9 * SR)
    rate[s0:] = np.linspace(1, 0.02, len(glitch) - s0) ** 1.5
    pos = np.cumsum(rate)
    pos = pos[pos < len(glitch) - 1]
    ts = np.stack([np.interp(pos, np.arange(len(glitch)), glitch[:, c]) for c in range(2)], axis=1)
    place(m, ts[: int(1.7 * SR)], 4.0)

    # Logo 6-9s: half-time, huge chord
    place(m, pad([note(41), note(53), note(57), note(60), note(64)], 3.0, 1800, 0.05) * 0.55, 6.0)
    place(m, sub(note(29), 2.0) * 0.6, 6.0)
    for b in [6.0, 7.0, 8.0]:
        place(m, kick(1.1), b, 0.9)
    place(m, clap(), 7.5, 0.5)
    # snare roll into the drop
    for k, b in enumerate(beats(8.0, 9.0, BEAT / 4)):
        place(m, clap(), b, 0.15 + 0.35 * k / 8)

    # Drop 9-18s: four-on-the-floor, Am | F | C | G | G
    prog = [(9, 45, [57, 60, 64]), (11, 41, [57, 60, 65]), (13, 48, [55, 60, 64]), (15, 43, [55, 59, 62]), (17, 43, [55, 59, 62])]
    for start, root, chord in prog:
        dur = 2.0 if start < 17 else 1.0
        for b in beats(start, start + dur):
            place(m, kick(), b, 0.95)
            place(m, hat(True), b + BEAT / 2, 0.22, pan=-0.2)
        for b in beats(start, start + dur, BEAT / 4):
            place(m, hat(), b, 0.1 if (b * 4) % 2 else 0.16, pan=0.35)
        for b in beats(start + BEAT, start + dur, 2 * BEAT):
            place(m, clap(), b, 0.55)
        for b in beats(start, start + dur, BEAT / 2):
            # sidechained sub: duck right after each kick
            s = sub(note(root - 12 + 12), BEAT / 2 * 0.95)
            env = np.minimum(1, t_arr(len(s) / SR) / 0.08)
            place(m, s * env * 0.42, b)
        stabs = [0, 0.75, 1.5] if dur == 2.0 else [0, 0.5]
        for off in stabs:
            for n_ in chord:
                place(m, pluck(note(n_ + 12)), start + off, 0.16, pan=rng.uniform(-0.5, 0.5))
        place(m, pad([note(n_) for n_ in chord], dur, 1200, 0.2) * 0.22, start)

    # Breakdown 18-21s: filtered pad, single kick, riser
    place(m, pad([note(45), note(57), note(60), note(64)], 1.5, 900, 0.3) * 0.9, 18.0)
    place(m, pad([note(41), note(57), note(60), note(65)], 1.5, 1100, 0.1) * 0.9, 19.5)
    place(m, kick(1.2), 18.0, 0.9)
    place(m, sfx_riser(1.5), 19.5, 0.45)

    # Outro 21-25s: groove returns, final chord at 23.5
    for b in beats(21, 23.5):
        place(m, kick(), b, 0.95)
        place(m, hat(True), b + BEAT / 2, 0.2, pan=-0.2)
    for b in beats(21 + BEAT, 23.5, 2 * BEAT):
        place(m, clap(), b, 0.5)
    for b in beats(21, 23.5, BEAT / 2):
        place(m, sub(note(33), BEAT / 2 * 0.95) * 0.42, b)
    place(m, pad([note(57), note(60), note(64)], 2.5, 1500, 0.05) * 0.25, 21)
    for off in [0, 0.75, 1.5]:
        for n_ in [57, 60, 64]:
            place(m, pluck(note(n_ + 12)), 21 + off, 0.15, pan=rng.uniform(-0.5, 0.5))
    return reverb(m, 0.18)


def build_sfx():
    s = np.zeros((N, 2))
    for cue in TL["sfx"]:
        kind = cue["type"]
        for k, f in enumerate(cue["at"]):
            at = f / FPS
            if kind == "tick":
                place(s, sfx_tick(), at, 0.9)
            elif kind == "tickFinal":
                place(s, sfx_tick(True), at, 1.0)
            elif kind == "glitch":
                place(s, sfx_glitch(), at, 0.8, pan=rng.uniform(-0.6, 0.6))
            elif kind == "powerDown":
                place(s, sfx_power_down(), at, 0.8)
            elif kind == "riser":
                place(s, sfx_riser(cue["length"] / FPS), at, 0.55)
            elif kind == "impact":
                place(s, sfx_impact(), at, 0.8)
            elif kind == "impactSoft":
                place(s, sfx_impact(True), at, 0.7)
            elif kind == "stamp":
                place(s, sfx_stamp(k), at, 0.7, pan=-0.6 + 0.2 * k)
            elif kind == "eject":
                place(s, sfx_whoosh(0.35, True), at, 0.7, pan=0.4)
                place(s, sfx_stamp(9) * 0.6, at, 0.6)
            elif kind == "snap":
                place(s, sfx_stamp(3), at, 0.8)
            elif kind == "typeClick":
                place(s, sfx_type(), at, 0.5, pan=rng.uniform(-0.3, 0.3))
            elif kind == "pop":
                place(s, sfx_pop(k), at, 0.55, pan=rng.uniform(-0.4, 0.4))
            elif kind == "whoosh":
                place(s, sfx_whoosh(), at - 0.2, 0.6, pan=0.0)
            elif kind == "zoom":
                place(s, sfx_whoosh(0.6, True), at, 0.8)
            elif kind == "tap":
                place(s, sfx_tap(), at, 0.8)
            elif kind == "ding":
                place(s, sfx_ding(k), at, 0.7, pan=0.25)
            elif kind == "reverseSwell":
                place(s, sfx_reverse_swell(cue["length"] / FPS), at, 0.5)
            elif kind == "shine":
                place(s, sfx_shine(), at, 0.8)
            elif kind == "stinger":
                place(s, sfx_stinger(), at, 0.6)
            else:
                raise ValueError(kind)
    return reverb(s, 0.12)


def duck_envelope(depth):
    """Gain curve that dips a bed by `depth` (0..1) while the narrator speaks."""
    vo_dir = os.path.join(ROOT, "public", "vo")
    durations = json.load(open(os.path.join(vo_dir, "durations.json")))["durations"]
    active = np.zeros(N)
    for v in TL["voice"]:
        a = int(v["from"] / FPS * SR)
        b = int((v["from"] / FPS + durations[v["id"]]) * SR)
        active[a:b] = 1
    # smooth attack/release
    win = int(0.12 * SR)
    kernel = np.hanning(win)
    kernel /= kernel.sum()
    smooth = np.convolve(active, kernel, mode="same")
    return 1 - depth * np.clip(smooth, 0, 1)


def normalize(x, peak_db=-1.0):
    peak = np.max(np.abs(x))
    return x / peak * 10 ** (peak_db / 20)


if __name__ == "__main__":
    out = os.path.join(ROOT, "public", "audio")
    os.makedirs(out, exist_ok=True)
    music = build_music()
    music *= duck_envelope(0.68)[:, None]  # about -10 dB under the voice
    music = np.tanh(normalize(music, -3) * 1.2)
    sf.write(os.path.join(out, "music.wav"), normalize(music, -3).astype(np.float32), SR)
    fx = build_sfx() * duck_envelope(0.45)[:, None]  # about -5 dB under the voice
    sf.write(os.path.join(out, "sfx.wav"), normalize(np.tanh(fx * 1.1), -3).astype(np.float32), SR)
    print("wrote", out)
