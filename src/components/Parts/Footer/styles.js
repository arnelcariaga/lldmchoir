import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footerLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none'
  },
}));

export {
  useStyles
}