import { CSSProperties, ReactNode } from "react";
import styles from "./AuroraBackground.module.css";

const paletteStyles = {
  contact: {
    main: "radial-gradient(60% 50% at 50% 0%, rgba(83, 214, 255, 0.2) 0%, rgba(9, 11, 16, 0.9) 60%)",
    layer:
      "radial-gradient(600px 300px at 30% 20%, rgba(120, 100, 255, 0.2), transparent 60%), radial-gradient(500px 260px at 70% 30%, rgba(83, 214, 255, 0.18), transparent 65%)",
  },
  cool: {
    main: "radial-gradient(60% 50% at 50% 0%, rgba(120, 224, 255, 0.16) 0%, rgba(8, 12, 18, 0.88) 60%)",
    layer:
      "radial-gradient(560px 280px at 28% 18%, rgba(70, 176, 255, 0.2), transparent 62%), radial-gradient(520px 260px at 72% 28%, rgba(78, 226, 255, 0.18), transparent 66%)",
  },
  violet: {
    main: "radial-gradient(60% 50% at 50% 0%, rgba(181, 133, 255, 0.22) 0%, rgba(10, 10, 20, 0.9) 60%)",
    layer:
      "radial-gradient(620px 320px at 30% 20%, rgba(181, 133, 255, 0.24), transparent 60%), radial-gradient(500px 250px at 70% 32%, rgba(131, 178, 255, 0.2), transparent 65%)",
  },
} as const;

const intensityStyles = {
  low: {
    layerOpacity: "0.7",
    gridOpacity: "0.16",
  },
  medium: {
    layerOpacity: "0.9",
    gridOpacity: "0.25",
  },
  high: {
    layerOpacity: "1",
    gridOpacity: "0.32",
  },
} as const;

export type AuroraPalette = keyof typeof paletteStyles;
export type AuroraIntensity = keyof typeof intensityStyles;

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
  palette?: AuroraPalette;
  intensity?: AuroraIntensity;
}

export default function AuroraBackground({
  children,
  className,
  palette = "contact",
  intensity = "medium",
}: AuroraBackgroundProps) {
  const classes = className
    ? `${styles.auroraBackground} ${className}`
    : styles.auroraBackground;

  const style: CSSProperties = {
    ["--aurora-main-gradient" as string]: paletteStyles[palette].main,
    ["--aurora-layer-gradient" as string]: paletteStyles[palette].layer,
    ["--aurora-before-opacity" as string]:
      intensityStyles[intensity].layerOpacity,
    ["--aurora-grid-opacity" as string]: intensityStyles[intensity].gridOpacity,
  };

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
