import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";
import { useStyles } from './styles'
import { useForm } from "react-hook-form";
import Logo from './../../Parts/Logo/'
import Footer from './../../Parts/Footer/'
import Cookies from 'js-cookie';
import {useDispatch} from 'react-redux'
import {signInAction} from './../../Redux/joinDucks'
import history from "./../../Parts/history";
import Dialog from  './../../Parts/Dialog/'

export default function SignIn() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const classes = useStyles();
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogDescription, setOpenDialogDescription] = useState();
  const [acceptBtnDialogDisable, setAcceptBtnDialogDisable] = useState(false);
  const [cancelBtnDialoDisable, setCancelBtnDialoDisable] = useState(false);

  useEffect(() => {
    function isLoggedFun() {
      const isLogged = Cookies.get('isLogged');
      if (isLogged) {
        history.push("/dashboard");
      }
    }
    isLoggedFun()
  },[])

  const onSubmit = async (data) => {
    const res = await dispatch(signInAction(data))
    if (res === "Datos incorrectos.") {
      setOpenDialogDescription(res)
      setAcceptBtnDialogDisable(true)
      setCancelBtnDialoDisable(false)
      setOpenDialog(true)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Link to="/"><Logo /></Link>
        <Typography component="h1" variant="h5">
			LLDM Choir
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Coreo electr&oacute;nico"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
            {...register("email", { 
              required: true,
              pattern: {
                value: /\S+@\S+.\S+/,
                message: "Formato de correo electrónico no válido."
              }
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contrase&ntilde;a"
            type="password"
            id="password"
            autoComplete="password"
            {...register("password", {
                required: true,
                maxLength: {
                  value: 8,
                  message: "Solo se permite un máximo de 8 carácteres",
                },
                minLength: {
                  value: 4,
                  message: "Tiene que ser mínimo 4 carácteres",
                },
              })}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Iniciar Sesi&oacute;n
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="" className={classes.link}>
                Olvid&eacute; mi contrase&ntilde;a
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" className={classes.link}>
                ¿ No tienes una cuenta ? Reg&iacute;strate
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

      <Dialog 
        openDialog={openDialog}
        handleClose={() => setOpenDialog(!openDialog)}
        titleDialog="Inicio de sesi&oacute;n | LLDM Choir"
        descriptionDialog={dialogDescription}
        acceptBtnDialogDisable={acceptBtnDialogDisable}
        cancelBtnDialoDisable={cancelBtnDialoDisable}
      />

      <Box mt={6}>
        <Footer />
      </Box>
    </Container>
  );
}
