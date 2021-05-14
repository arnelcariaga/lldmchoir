import React, { useState, useEffect } from 'react';
import { getSongsAction } from "./../../Redux/songsDucks";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { useStyles } from "./styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {IconContext} from "react-icons";
import {
  MdFileDownload,
} from "react-icons/md";
import {
  FaSignOutAlt
} from "react-icons/fa";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Logo from './../../Parts/Logo/'
import Footer from './../../Parts/Footer/'
import Cookies from 'js-cookie';
import { columns } from './../Dashboard/columns'
import { FilterComponent } from './../Dashboard/FilterComponent'
import history from './../../Parts/history'
import {urlFetch} from './../../Parts/url_fetch'

const Dashboard = ({theme}) => {
  const dispatch = useDispatch();
  const [innerData, setInnerData] = useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    function isLoggedFun() {
      const getIsLogged = Cookies.get('isLogged');
      if (getIsLogged === "true") {
        setIsLogged(true)
      }
    }
    isLoggedFun()
  },[])

  useEffect(() => {
   async function getFilesFunc() {
      const songs = await dispatch(getSongsAction())
      setInnerData(songs);
    }
    getFilesFunc();
  }, [dispatch]);

  const createColumns = () => {
    return [
      ...columns,
      {
        name: 'Descargar',
        allowOverflow: true,
        minWidth: '200px',
        cell: row => {
          return <div>
          <IconButton aria-label="download" href={urlFetch+row.song_path} target="_blank">
            <IconContext.Provider value={{ color: "#488e48" }}>
    		   		<MdFileDownload />
    		   	</IconContext.Provider>
    		  </IconButton>

          </div>;
        },
      },
    ];
  };

  const subHeaderComponentMemo = () => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
    <Grid container justify="flex-end">

    <Grid item>
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    </Grid>
    </Grid>
    );
  };

  const filteredItems = innerData.filter((item) => {
    let categories = item.categories.some(
      (c) =>
        c.category_name &&
        c.category_name.toLowerCase().includes(filterText.toLowerCase())
    );
    return (
      (item.song_name &&
        item.song_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.file_type &&
        item.file_type.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.song_published_date &&
        item.song_published_date
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.language_name &&
        item.language_name.toLowerCase().includes(filterText.toLowerCase())) ||
      categories
    );
  });

  const logout = async () => {
    Cookies.remove('userData', { path: '/'});
    Cookies.remove('isLogged', { path: '/'});
    history.push("/signin")
  }

  return (
    <Grid className={classes.content}>

      {subHeaderComponentMemo()}

     <Box boxShadow={3} mb={4}>
    <DataTable
      title={
      	<Box mb={5}>
      	<Logo />
      	<Typography component="span" variant="h5" style={{fontWeight: 'bold'}}>LLDM</Typography>
      	<Typography component="span" variant="button"> Choir</Typography>
      </Box>
  	}
      columns={createColumns()}
      data={filteredItems}
      theme={theme}
      paginationResetDefaultPage={resetPaginationToggle}
      pagination
      noDataComponent={
      	<Typography paragraph>
      		No hay archivos para mostrar.
      	</Typography>
      }
      highlightOnHover
      dense
      paginationComponentOptions={{ rowsPerPageText: 'Cantidad por página:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'All' }}
      actions={
        isLogged ?
        <Box> 
        <Button variant="contained" startIcon={<FaSignOutAlt />} size="small" color={theme === "dark" ? "default" : "primary"} onClick={() => history.push("/signin")}>
            Panel
        </Button> 
        <Button variant="contained" style={{margin: 5}} size="small" startIcon={<FaSignOutAlt />} color={theme === "dark" ? "default" : "primary"} onClick={logout}>
            Cerrar sesi&oacute;n
        </Button>
        </Box> :

        <Button variant="contained" size="small" startIcon={<FaSignOutAlt />} color={theme === "dark" ? "default" : "primary"} onClick={() => history.push("/signin")}>
            Iniciar sesi&oacute;n
        </Button>
      }
    />
    </Box>

    <Footer />

    </Grid>
  );
};

export default Dashboard