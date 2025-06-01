import  { theme }  from "../Interfaces/Themes";

export function getThemeFromString(themeName: string): theme | undefined {
  switch (themeName.toLowerCase()) {
    case "classic":
      return theme.Classic;
    case "dark":
      return theme.Dark;
    case "light":
      return theme.Light;
    // add more cases if needed
    default:
      return undefined;
  }
}
