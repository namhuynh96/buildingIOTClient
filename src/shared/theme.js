import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: {
      main: "#388e3c"
    }
  }
});

export default theme;
