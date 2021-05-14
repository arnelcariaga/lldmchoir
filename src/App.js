import React, { useState, useEffect } from 'react';
import {
  Router,
  Switch as SwitchRoute,
  Route
} from "react-router-dom";
import {Provider} from 'react-redux'
import generateStore from './components/Redux/store'
import history from './components/Parts/history'
import SignUpForm from './components/Pages/SignUp_form/'
import SingInForm from './components/Pages/SignIn_form/'
import Dashboard from './components/Pages/Dashboard/'
import Site from './components/Pages/Site/'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
  MdHelp
} from "react-icons/md";

function App() {
  const store = generateStore()
  const [theme, setTheme] = useState({
    palette: {
      type: "light"
    }
  });

  const toggleDarkTheme = () => {
    let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    setTheme({
      palette: {
        type: newPaletteType
      }
    });
    localStorage.setItem('theme', newPaletteType);
  };

  useEffect(() => {
    const getTheme = localStorage.getItem('theme');
    if (getTheme !== null) {
      setTheme({
        palette: {
          type: getTheme
        }
      });
    }
  },[])

  const muiTheme = createMuiTheme(theme);

  return (
  <MuiThemeProvider theme={muiTheme}>
  <CssBaseline />

  <Grid container justify="space-between">
  <Box ml={4} mt={4}>
  <FormControlLabel
            label="Modo oscuro"
            control={
              <Switch
                size="small"
                checked={muiTheme.palette.type === "dark"}
                onChange={toggleDarkTheme}
              />
            }
          />
          </Box>

          <Box mr={3} mt={3}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<MdHelp />}
              size="small"
              onClick={() => alert("Cualquier sugerencia o comentarios, favor de escribirnos al correo: acariaga@udoym.edu.do")}
            >
              Soporte o sugerencias
            </Button>
          </Box>
  </Grid>

  <Provider store={store}>
    <Router  history={history}>
      <SwitchRoute>

          <Route exact path="/">
            <Site theme={muiTheme.palette.type} />
          </Route>

          <Route path="/signin">
            <SingInForm />
          </Route>

          <Route path="/signup">
            <SignUpForm />
          </Route>

          <Route path="/dashboard">
            <Dashboard theme={muiTheme.palette.type} />
          </Route>
          
      </SwitchRoute>
    </Router>
  </Provider>
  </MuiThemeProvider>
    );
}

export default App;