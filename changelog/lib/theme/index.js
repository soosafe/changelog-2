import { extendTheme } from "@chakra-ui/react";
import typography from "./typograpy";
import sizes, { baseSizes } from "./sizes";
import colors from "./colors";
import Button from "./Button";
import { mode } from "@chakra-ui/theme-tools";

const overrides = {
  ...typography,
  initialColorMode: "light",
  useSystemColorMode: true,
  space: baseSizes,
  sizes,
  colors,
  components: {
    Button,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode("white", "black")(props),
      },
    }),
  },
};

const juneTheme = extendTheme(overrides);

export default juneTheme;
