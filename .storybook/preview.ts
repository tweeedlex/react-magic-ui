import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        gradient: {
          name: "gradient",
          value: "linear-gradient(180deg, rgba(56, 173, 241) 0%, rgba(120, 82, 247) 35%, rgba(36, 36, 68) 100%) no-repeat center center fixed",
          style: {
            backgroundSize: 'cover',
          },
        },

        light: {
          name: 'light',
          value: '#ffffff'
        },

        image: {
          name: 'image',
          value: 'url("https://png.pngtree.com/thumb_back/fh260/background/20210929/pngtree-glassmorphism-wave-effect-abstract-background-image_908575.png") 0 0 / cover no-repeat fixed'
        },

        dark: {
          name: 'dark',
          value: '#000000'
        }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'gradient'
    }
  }
};

export default preview;
