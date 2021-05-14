import Avatar from '@material-ui/core/Avatar';
import LogoIcon from './../assets/288e8c9caa38da3d3d42fe9a3858e9b2.jpg'
import { useStyles } from './styles'

function Logo() {
	const classes = useStyles();

  return (
    <Avatar alt="LLDM Choir" src={LogoIcon} className={classes.large} />
  );
}

export default Logo;