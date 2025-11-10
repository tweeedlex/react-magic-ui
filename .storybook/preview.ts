import type { Preview } from "@storybook/react-vite";
import "../src/tailwind.css"

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
          value:
            "linear-gradient(180deg, rgba(56, 173, 241) 0%, rgba(120, 82, 247) 35%, rgba(36, 36, 68) 100%) no-repeat center center fixed",
          style: {
            backgroundSize: "cover",
          },
        },

        light: {
          name: "light",
          value: "#ffffff",
        },

        image: {
          name: "image",
          value:
            'url("https://images.unsplash.com/photo-1673526759327-54f1f5b27322?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8") 0 0 / cover no-repeat fixed',
        },
        imageDark: {
          name: "image-dark",
          value:
            'url("https://png.pngtree.com/png-vector/20220615/ourlarge/pngtree-seamless-pattern-of-grid-with-transparency-effect-in-png-for-photoshop-vector-png-image_47094852.jpg") 0 0 / cover no-repeat fixed',
        },
        imageNature: {
          name: "image-nature",
          value:
            'url("https://images.unsplash.com/photo-1683657535824-5b570c7a1749?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center / cover no-repeat fixed ',
        },

        dark: {
          name: "dark",
          value: "#000000",
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "gradient",
    },
  },
};

export default preview;
