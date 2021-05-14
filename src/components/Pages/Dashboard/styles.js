import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
  	margin: theme.spacing(3),
  },
  input: {
    display: 'none',
  },
  linearIntermitate: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

export {
  useStyles
}