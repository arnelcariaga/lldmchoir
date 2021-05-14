import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { useForm } from "react-hook-form";
import {useDispatch, useSelector} from 'react-redux'
import {getLanguagesAction} from './../../Redux/languagesDucks'
import {addSongAction} from './../../Redux/songsDucks'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { useStyles } from "./styles";
import {
  MdFileUpload
} from "react-icons/md";
import {getSongsCategoriesAction} from './../../Redux/songsDucks'
import history from "./../../Parts/history"
import ProgressBar from './../../Parts/progress_bar'

const initialValues = {
  song_name: "",
  file: "",
  language: "",
  categories: []
};

export default function AddSongDialog({
  openAddSongDialog,
  handleAddSongDialog,
  theme
}) {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const dispatch = useDispatch()
  const classes = useStyles();
  const languagesData = useSelector((store) => store.languagesData.languages);
  const songCategoryData = useSelector((store) => store.songsData.songsCategories);
  const addSongResults = useSelector((store) => store.songsData.addSongResults);
  const [inputsVal, setInputsVal] = useState(initialValues);
  const songUploadProgress = useSelector((store) => store.songsData.songUploadProgress);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);

  useEffect(() => {
      function getLanguageFunc() {
        dispatch(getLanguagesAction());
      }
      getLanguageFunc();
    }, [dispatch]);

  useEffect(() => {
    function getSongCategoriesFunc(){
      dispatch(getSongsCategoriesAction());
    }
    getSongCategoriesFunc()
  },[dispatch])

  const onChangeInputs = (e) => {
    const { name, value } = e.target;

    setInputsVal({
      ...inputsVal,
      [name]: value,
    });
  }

  const onSubmit = async (data, e) => {
    setSubmitBtnDisabled(true)
    e.preventDefault();
    dispatch(addSongAction(data));
  }

  return (
      <Dialog open={openAddSongDialog} aria-labelledby="form-dialog-title" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Agregar alabanza</DialogTitle>
        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="song_name"
                label="Nombre de la alabanza"
                name="song_name"
                autoComplete="song_name"
                autoFocus
                {...register("song_name", { required: true })}
                error={!!errors.song_name}
                onChange={onChangeInputs}
                value={inputsVal.song_name}
              />

              <FormControl variant="outlined" fullWidth margin="normal" className={classes.root}>
                <input
                  className={classes.input}
                  id="file"
                  name="file"
                  type="file"
                  {...register("file", { 
                    required: true, 
                    validate: (value) => {
                        if (value.length !== 0) {
                          if (value[0].size > 50 * 1024 * 1024) {
                            return "El tamaño del archivo excede los 50MB.";
                          }
                        }
                      },
                  } ) }
                />
                <Typography variant="subtitle1" color="secondary">{errors.file && errors.file.message}</Typography>
                <label htmlFor="file">
                  <Button variant="outlined" color={errors.file === undefined ? "default" : "secondary"} startIcon={<MdFileUpload />} component="span">
                    Subir archivo
                  </Button>
                </label>
                <Typography component="strong" variant="subtitle2">Tama&ntilde;o m&aacute;ximo por archivo: <code>15MB</code></Typography>

                <ProgressBar progress={songUploadProgress} />

              </FormControl>

              <FormControl variant="outlined" fullWidth margin="normal" required error={!!errors.language}>
                <InputLabel htmlFor="grouped-select">Idioma</InputLabel>
                <Select 
                  id="grouped-select" 
                  name="language"
                  {...register("language", { required: true, } ) }
                  onChange={onChangeInputs}
                  value={inputsVal.language}
                >
                  {
                    languagesData.length === null ? null : 
                    languagesData.map((res) => {
                      return <MenuItem key={res.language_id.toString()} value={res.language_id}>{res.language_name}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal" required error={!!errors.categories}>
                <InputLabel htmlFor="grouped-select">Categorías</InputLabel>
                <Select 
                  id="grouped-select" 
                  name="categories"
                  value={inputsVal.categories}
                  {...register("categories", { required: true, } ) }
                  multiple
                  onChange={onChangeInputs}
                >
                  {
                    songCategoryData.map((res) => {
                      return <MenuItem key={res.category_id.toString()} value={res.category_id}>{res.category_name}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <DialogActions>
              <Button onClick={() => history.go(0)} variant="outlined" color="secondary">
                Cancelar
              </Button>
              <Button color={theme === "dark" ? "default" : "primary"} variant="outlined" type="submit" disabled={submitBtnDisabled}>
                Agregar
              </Button>
            </DialogActions>
            </form>

        </DialogContent>

        {
          addSongResults.length === 0 ? null : 
          <Dialog open={true} fullWidth={true}>
            <DialogTitle id="form-dialog-title">Agregar alabanza</DialogTitle>

            <DialogContent>
              <Typography>
                La alabanza se ha agregado con &eacute;xito.
              </Typography>

              <DialogActions>
              <Button color={theme === "dark" ? "default" : "primary"} onClick={() => history.go(0)}>
                Aceptar
              </Button>
            </DialogActions>

            </DialogContent>
          </Dialog>
        }
        
      </Dialog>
  );
}