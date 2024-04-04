import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { TbMoon, TbSun } from "react-icons/tb";
const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  return (
    
      <Button
        isIconOnly
        variant="light"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <TbSun  /> : <TbMoon  />}
      </Button>
    
  );
};

export default ThemeChanger;
