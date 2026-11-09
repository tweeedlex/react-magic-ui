import type { Decorator, Preview } from "@storybook/react-vite";
import theme from "./theme";
import "../src/styles/preview.css";

type Wallpaper = {
  title: string;
  /** CSS background */
  background: string;
  /** ink that reads on it in the light theme */
  tone: "light" | "dark";
};

/** Everything is local and resolution-free, so the glass never refracts JPEG noise. */
const WALLPAPERS: Record<string, Wallpaper> = {
  aurora: {
    title: "Aurora",
    tone: "dark",
    background: [
      "radial-gradient(at 8% 12%, #5ac8fa 0, transparent 46%)",
      "radial-gradient(at 92% 8%, #bf5af2 0, transparent 44%)",
      "radial-gradient(at 88% 92%, #ff9f0a 0, transparent 46%)",
      "radial-gradient(at 12% 94%, #ff375f 0, transparent 44%)",
      "radial-gradient(at 50% 50%, #e9e4ff 0, transparent 70%)",
      "#dfe7ff",
    ].join(", "),
  },
  midnight: {
    title: "Midnight",
    tone: "light",
    background: [
      "radial-gradient(at 15% 20%, #1d4ed8 0, transparent 50%)",
      "radial-gradient(at 85% 25%, #7c3aed 0, transparent 48%)",
      "radial-gradient(at 70% 95%, #db2777 0, transparent 50%)",
      "radial-gradient(at 10% 90%, #0891b2 0, transparent 45%)",
      "#0a0a1a",
    ].join(", "),
  },
  blobs: {
    title: "Blobs (demo)",
    tone: "light",
    background: 'center / cover no-repeat url("./wallpapers/photo.jpg"), #2a0b45',
  },
  light: { title: "Flat light", tone: "dark", background: "#f2f2f7" },
  dark: { title: "Flat dark", tone: "light", background: "#000000" },
};

/**
 * Paints the wallpaper, applies theme + ink, and centres the story.
 * Runs per canvas, so docs pages get the same stage as the story view.
 */
const withStage: Decorator = (Story, context) => {
  const wallpaper = WALLPAPERS[context.globals.wallpaper as string] ?? WALLPAPERS.aurora;
  const dark = context.globals.theme === "dark";
  const tone = dark ? "light" : wallpaper.tone;
  const wide = context.parameters.stage === "wide";
  const classes = [
    "sb-stage",
    context.viewMode === "docs" ? "sb-stage--docs" : "sb-stage--story",
    wide && "sb-stage--wide",
    dark && "dark",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} data-glass-tone={tone} style={{ background: wallpaper.background }}>
      <div className="sb-stage__content">
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [withStage],
  globalTypes: {
    wallpaper: {
      description: "Wallpaper behind the glass",
      toolbar: {
        title: "Wallpaper",
        icon: "photo",
        dynamicTitle: true,
        items: Object.entries(WALLPAPERS).map(([value, w]) => ({ value, title: w.title })),
      },
    },
    theme: {
      description: "Light or dark theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
      },
    },
  },
  initialGlobals: {
    wallpaper: "aurora",
    theme: "light",
  },
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color|tint)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme,
      codePanel: true,
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Glass",
          "GlassText",
          "Button",
          "Badge",
          "Card",
          "Input",
          "Switch",
          "Checkbox",
          "Slider",
          "Select",
          "Tabs",
          "Modal",
          "Toast",
          "Topbar",
          "Sidebar",
        ],
      },
    },
  },
};

export default preview;
