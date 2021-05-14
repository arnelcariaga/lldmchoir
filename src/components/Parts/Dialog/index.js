import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import history from "./../history"

export default function ResponsiveDialog({
  openDialog,
  handleClose,
  titleDialog,
  descriptionDialog,
  acceptBtnDialogDisable,
  cancelBtnDialoDisable,
  acceptBtnDialogPath,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{titleDialog}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {descriptionDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            cancelBtnDialoDisable ? null : 
            <Button autoFocus onClick={handleClose} color="primary">
              Cancelar
            </Button>
          }
          
          {
            acceptBtnDialogDisable ? null :
            <Button onClick={() => history.push(acceptBtnDialogPath)} color="primary" autoFocus>
              Aceptar
            </Button>
          }
        </DialogActions>
      </Dialog>
  );
}