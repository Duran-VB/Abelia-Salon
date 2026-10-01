import { Composition, Folder } from "remotion";
import { MchineReel } from "./MchineReel";
import { Build } from "./scenes/Build";
import { Convert } from "./scenes/Convert";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Logo } from "./scenes/Logo";
import { Pillars } from "./scenes/Pillars";
import { Rebuilt } from "./scenes/Rebuilt";
import { Waste } from "./scenes/Waste";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MchineReel"
        component={MchineReel}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Scenes">
        <Composition
          id="Hook"
          component={Hook}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            topA: "You have",
            bottomA: "seconds.",
            topB1: "That's all",
            topB2: "a visitor",
            bottomB1: "gives your",
            bottomB2: "website.",
          }}
        />
        <Composition
          id="Waste"
          component={Waste}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ line1: "Most websites", line2: "waste them." }}
        />
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ label: "Web design & development", tagline: "Websites, engineered." }}
        />
        <Composition
          id="Build"
          component={Build}
          durationInFrames={105}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ a1: "We design", a2: "& build", a3: "websites", b1: "that work", b2: "as hard", b3: "as you do." }}
        />
        <Composition
          id="Pillars"
          component={Pillars}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ designTitle: "Sharp|design.", codeTitle: "Clean|code.", speedTitle: "Built for|speed." }}
        />
        <Composition
          id="Convert"
          component={Convert}
          durationInFrames={75}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ lead: "Made to turn", before: "scrollers", after: "customers.", toasts: "New booking|New enquiry|New order" }}
        />
        <Composition
          id="Rebuilt"
          component={Rebuilt}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ line1: "Your", line2: "business,", payoff: "REBUILT.", services: "Design — Build — Launch" }}
        />
        <Composition
          id="CTA"
          component={Cta}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ brand: "MCHINE", line1: "Let's build", line2: "yours.", button: "Link in bio", footer: "Web design & development" }}
        />
      </Folder>
    </>
  );
};
