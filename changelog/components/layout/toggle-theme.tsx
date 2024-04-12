import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";

export function ToggleTheme() {
  const { toggleColorMode } = useColorMode();

  return (
    <header>
      <IconButton
        aria-label="Mode Change"
        variant="outline"
        colorScheme="black"
        size="lg"
        icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
        onClick={toggleColorMode}
      />
    </header>
  );
}
