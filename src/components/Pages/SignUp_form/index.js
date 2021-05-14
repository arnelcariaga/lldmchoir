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
import Logo from './../../Parts/Logo/'
import Footer from './../../Parts/Footer/'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import {signUpAction} from './../../Redux/joinDucks'
import {useDispatch} from 'react-redux'
import history from "./../../Parts/history"
import Dialog from  './../../Parts/Dialog/'

export default function SignUp() {
  const { register, formState: { errors }, handleSubmit, getValues } = useForm();
  const classes = useStyles();
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogDescription, setOpenDialogDescription] = useState();
  const [acceptBtnDialogDisable, setAcceptBtnDialogDisable] = useState(false);
  const [cancelBtnDialoDisable, setCancelBtnDialoDisable] = useState(false);
  const [acceptBtnDialogPath, setAcceptBtnDialogPath] = useState();

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
    const res = await dispatch(signUpAction(data))
    if (res === "Este usuario ya existe.") {
      setOpenDialogDescription(res)
      setAcceptBtnDialogDisable(true)
      setCancelBtnDialoDisable(false)
      setOpenDialog(true)
    }else if (res === "Registrado con éxito.") {
      setOpenDialogDescription(res)
      setAcceptBtnDialogPath("/signin")
      setCancelBtnDialoDisable(true)
      setAcceptBtnDialogDisable(false)
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
            id="user_name"
            label="Nombre de usuario"
            name="user_name"
            autoComplete="user_name"
            autoFocus
            {...register("user_name", { required: true })}
            error={!!errors.user_name}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Coreo electr&oacute;nico"
            name="email"
            autoComplete="email"
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
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Repetir contrase&ntilde;a"
            type="password"
            id="confirm_password"
            autoComplete="confirm_password"
            {...register("confirm_password", {
                required: true,
                validate: (value) =>
                  value === getValues("password") ||
                  "Esta contraseña no coincide con la anterior",
                maxLength: {
                  value: 8,
                  message: "Solo se permite un máximo de 8 carácteres",
                },
                minLength: {
                  value: 4,
                  message: "Tiene que ser mínimo 4 carácteres",
                },
              })}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password && errors.confirm_password.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrarme
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin" className={classes.link}>
                ¿ Ya tienes una cuenta ? Inicia Sesi&oacute;n
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

      <Dialog 
        openDialog={openDialog}
        handleClose={() => setOpenDialog(!openDialog)}
        titleDialog="Registrar usuario | LLDM Choir"
        descriptionDialog={dialogDescription}
        acceptBtnDialogDisable={acceptBtnDialogDisable}
        cancelBtnDialoDisable={cancelBtnDialoDisable}
        acceptBtnDialogPath={acceptBtnDialogPath}
      />

      <Box mt={6}>
        <Footer />
      </Box>
    </Container>
  );
}
