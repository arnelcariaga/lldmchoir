import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useDispatch} from 'react-redux'
import Typography from '@material-ui/core/Typography';
import {deleteSongAction} from './../../Redux/songsDucks'

export default function DeleteSongDialog({
  openDeleteSongDialog,
  handleDeleteSongDialog,
  theme,
  songId
}) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const delSongResp = await dispatch(deleteSongAction(songId))
    if (delSongResp === "La alabanza se ha eliminado con éxito.") {
      handleDeleteSongDialog()
    }
  }

  return (
      <Dialog open={openDeleteSongDialog} aria-labelledby="form-dialog-title" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Eliminar alabanza</DialogTitle>
        <DialogContent>
          
          <Typography>¿Estas segur@ que quieres elimnar esta alabanza?</Typography>
          <Typography>Al aceptar no habr&aacute; marcha atr&aacute;s, tambi&eacute;n se eliminar&aacute; el archivo.</Typography>

        </DialogContent>

        <DialogActions>
              <Button color={theme === "dark" ? "default" : "primary"} onClick={handleDeleteSongDialog}>
                Cancelar
              </Button>

              <Button color="secondary" onClick={handleDelete}>
                Eliminar
              </Button>
        </DialogActions>
      </Dialog>
  );
}