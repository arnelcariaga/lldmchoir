import {
  Link
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';

import { useStyles } from './styles'

function Footer() {
	const classes = useStyles();

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link to="/" className={classes.footerLink}>
        <strong>LLDM Choir.</strong>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Footer;