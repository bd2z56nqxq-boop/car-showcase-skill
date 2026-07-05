import { Composition } from "remotion";
import { CarShowcase } from "./CarShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CarShowcase"
      component={CarShowcase}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
