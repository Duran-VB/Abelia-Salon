import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Grain } from "./components/Atmosphere";
import { Hud } from "./components/Hud";
import { Flash, GlitchBars, Whip } from "./components/Transitions";
import { Build } from "./scenes/Build";
import { Convert } from "./scenes/Convert";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Logo } from "./scenes/Logo";
import { Pillars } from "./scenes/Pillars";
import { Rebuilt } from "./scenes/Rebuilt";
import { Waste } from "./scenes/Waste";
import { C, voice } from "./theme";

/**
 * MCHINE - 25s Instagram Reel (1080x1920, 30fps).
 * Narration starts and SFX cues live in src/timeline.json, which the audio
 * script (scripts/audio.py) also reads to place sound and duck the music.
 * Keep scene durations here in step with timeline.json "scenes".
 */
export const MchineReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <TransitionSeries name="Scenes">
        <TransitionSeries.Sequence name="Hook" durationInFrames={120} premountFor={fps}>
          <Hook topA="You have" bottomA="seconds." topB1="That's all" topB2="a visitor" bottomB1="gives your" bottomB2="website." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={10} premountFor={fps}>
          <GlitchBars />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Waste" durationInFrames={60} premountFor={fps}>
          <Waste line1="Most websites" line2="waste them." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={8} premountFor={fps}>
          <Flash color="#FFFFFF" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Logo" durationInFrames={90} premountFor={fps}>
          <Logo label="Web design & development" tagline="Websites, engineered." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={8} premountFor={fps}>
          <Flash color={C.signal} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Build" durationInFrames={105} premountFor={fps}>
          <Build a1="We design" a2="& build" a3="websites" b1="that work" b2="as hard" b3="as you do." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={12} premountFor={fps}>
          <Whip color={C.signal} accent={C.bone} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Pillars" durationInFrames={90} premountFor={fps}>
          <Pillars designTitle="Sharp|design." codeTitle="Clean|code." speedTitle="Built for|speed." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={12} premountFor={fps}>
          <Whip color={C.ink2} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Convert" durationInFrames={75} premountFor={fps}>
          <Convert lead="Made to turn" before="scrollers" after="customers." toasts="New booking|New enquiry|New order" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={12} premountFor={fps}>
          <Whip color={C.signal} accent={C.ink} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Rebuilt" durationInFrames={90} premountFor={fps}>
          <Rebuilt line1="Your" line2="business," payoff="REBUILT." services="Design — Build — Launch" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={8} premountFor={fps}>
          <Flash color={C.signal} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="CTA" durationInFrames={120} premountFor={fps}>
          <Cta brand="MCHINE" line1="Let's build" line2="yours." button="Link in bio" footer="Web design & development" />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Hud />
      <Grain />

      <Audio name="Music" src={staticFile("audio/music.wav")} volume={0.5} premountFor={fps} />
      <Audio name="SFX" src={staticFile("audio/sfx.wav")} volume={0.6} premountFor={fps} />
      <Audio name="VO: You have three seconds" from={voice("p01").from} src={staticFile("vo/p01.wav")} premountFor={fps} />
      <Audio name="VO: That's all a visitor gives" from={voice("p02").from} src={staticFile("vo/p02.wav")} premountFor={fps} />
      <Audio name="VO: Most websites waste them" from={voice("p03").from} src={staticFile("vo/p03.wav")} premountFor={fps} />
      <Audio name="VO: Meet MCHINE" from={voice("p04").from} src={staticFile("vo/p04.wav")} premountFor={fps} />
      <Audio name="VO: We design and build" from={voice("p05").from} src={staticFile("vo/p05.wav")} premountFor={fps} />
      <Audio name="VO: Sharp design" from={voice("p06").from} src={staticFile("vo/p06.wav")} premountFor={fps} />
      <Audio name="VO: Clean code" from={voice("p07").from} src={staticFile("vo/p07.wav")} premountFor={fps} />
      <Audio name="VO: Built for speed" from={voice("p08").from} src={staticFile("vo/p08.wav")} premountFor={fps} />
      <Audio name="VO: Scrollers into customers" from={voice("p09").from} src={staticFile("vo/p09.wav")} premountFor={fps} />
      <Audio name="VO: Your business, rebuilt" from={voice("p10").from} src={staticFile("vo/p10.wav")} premountFor={fps} />
      <Audio name="VO: Let's build yours" from={voice("p11").from} src={staticFile("vo/p11.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
};
