import React, { useRef, useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {IconContext} from "react-icons";
import {
  MdDelete,
  MdEdit,
  MdFileDownload,
  MdSave,
  MdCancel,
  MdFileUpload
} from "react-icons/md";
import {
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {
  getSongsByUserAction, 
  updateSongAction
} from './../../Redux/songsDucks'
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Logo from './../../Parts/Logo/'
import Footer from './../../Parts/Footer/'
import AddSongDialog from './AddSongDialog'
import DeleteSongDialog from './DeleteSongDialog'
import Cookies from 'js-cookie';
import { columns } from './columns'
import { FilterComponent } from './FilterComponent'
import history from './../../Parts/history'
import {urlFetch} from './../../Parts/url_fetch'

const currentDate = new Date();

const EditableCell = ({ row, index, column, col, onChange }) => {
  const [value, setValue] = useState(row[column.selector]);
  const songCategoryData = useSelector((store) => store.songsData.songsCategories);
  const languagesData = useSelector((store) => store.languagesData.languages);

  const handleOnChange = e => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleOnChangeCategory = e => {
  	var selected = e.target.value.length
  	if (selected === 0) {
  		return false
  	}
    onChange?.(e, songCategoryData);
  };

  const handleOnChangeLanguage = e => {
    onChange?.(e, languagesData);
  };

  if (column?.editing && column.name === "Categorías") {
    const songCategoriesMap = row.categories.map((res) => res.category_id)
    return <FormControl fullWidth margin="normal" required onClick={(e) => e.stopPropagation()}>
                <InputLabel htmlFor="grouped-select">Categorías</InputLabel>
                <Select 
                  defaultValue={songCategoriesMap}
                  id="grouped-select" 
                  name="categories"
                  multiple
                  onChange={handleOnChangeCategory}
                >
                  {
                    songCategoryData.map((res) => {
                      return <MenuItem key={res.category_id.toString()} value={res.category_id}>{res.category_name}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
  }

  if (column?.editing && column.name === "Idioma") {
    const languagesMap = row.language_id
    return <FormControl fullWidth margin="normal" required onClick={(e) => e.stopPropagation()}>
                <InputLabel htmlFor="grouped-select">Idioma</InputLabel>
                <Select 
                  defaultValue={languagesMap}
                  id="grouped-select" 
                  name="language_name"
                  onChange={handleOnChangeLanguage}
                >
                  {
                    languagesData.map((res) => {
                      return <MenuItem key={res.language_id.toString()} value={res.language_id}>{res.language_name}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
  }

  if (column?.editing && column.name === "Nombre") {
    return (
    <FormControl fullWidth style={{marginTop: 23}} required>
      <TextField
        type={column.type || 'text'}
        name={column.selector}
        style={{ width: '100%' }}
        onChange={handleOnChange}
        value={value}
      />
    </FormControl>
    );
  }

  if (col.cell) {
    return col.cell(row, index, column);
  }
  return row[column.selector];
};

const Dashboard = ({theme}) => {
  const dispatch = useDispatch();
  const [innerData, setInnerData] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filterText, setFilterText] = useState("");
  const classes = useStyles();
  let formData = useRef({}).current;
  const isEditing = record => record.song_id === editingId;
  const [openAddSongDialog, setOpenAddSongDialog] = useState(false);
  const [openDeleteSongDialog, setOpenDeleteSongDialog] = useState(false);
  const [songId, setSongId] = useState();
  
  useEffect(() => {
    function isLoggedFun() {
      const isLogged = Cookies.get('isLogged');
      if (isLogged !== "true") {
        history.push("/");
      }
    }
    isLoggedFun()
  },[])

  useEffect(() => {
  async function getFilesFunc() {
      const songs = await dispatch(getSongsByUserAction())
      setInnerData(songs)
    }
    getFilesFunc();
  }, [dispatch]);

  const formOnChange = (event, c) => {
    const nam = event.target.name;
    const val = event.target.value;

    const date = String(currentDate.getDate()).padStart(2, '0'),
    month = String(currentDate.getMonth() + 1).padStart(2, '0'),
    year = currentDate.getFullYear(),
    hour = String(currentDate.getHours()).padStart(2, '0'),
    minutes = String(currentDate.getMinutes()).padStart(2, '0'),
    seconds = String(currentDate.getSeconds()).padStart(2, '0');

    var time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
    
    if (nam === "categories") {
    	const newVal = c.filter((res) => {
    		return val.every((v) => val.includes(res.category_id))
    	})
    	formData = {
	      ...formData,
	      [nam]: newVal,
	      last_edit_date: time
	    };
    }else if (nam === "language_name") {
    	const getLanguage = c.filter((res) => {
    		return res.language_id === val
    	})

    	const newValLanguageName = getLanguage.map((res) => {
    		return res.language_name
    	})

    	const newValLanguageId = getLanguage.map((res) => {
    		return res.language_id
    	})
    	formData = {
	      ...formData,
	      [nam]: newValLanguageName,
	      language_id: newValLanguageId,
	      last_edit_date: time
	    };
    }else{
    	formData = {
      ...formData,
      [nam]: val,
      last_edit_date: time
    };
    }
    
  };

  const edit = record => {
    setEditingId(record.song_id);
  };

  const cancel = () => {
    setEditingId('');
  };

  const deleteRow = row => {
    setOpenDeleteSongDialog(!openDeleteSongDialog)
    setSongId(row.song_id)
  };

  const save = async item => {
    const payload = { ...item, ...formData };
    const tempData = [...innerData];
    const index = tempData.findIndex(item => editingId === item.song_id);

    if (index > -1) {
      const item = tempData[index];
      tempData.splice(index, 1, {
        ...item,
        ...payload,
      });
      setInnerData(tempData);
      const updateSongResp = await dispatch(updateSongAction(payload));
      if (updateSongResp === "La alabanza se ha actualizado con éxito.") {
        setEditingId('');
      }
    }
  }

  const handleAddSongDialog = () => {
  	setOpenAddSongDialog(!openAddSongDialog)
  }

  const handleDeleteSongDialog = () => {
    setOpenDeleteSongDialog(!openDeleteSongDialog)
    var index = innerData.filter((item) => item.song_id !== songId)
     //dispatch(deleteSongAction(row.song_id))
     setInnerData(index);
  }

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      cell: (row, index, column) => {
        const editing = isEditing(row);
        return (
          <EditableCell
            row={row}
            index={index}
            column={{ ...column, editing }}
            col={col}
            onChange={formOnChange}
          />
        );
      },
    };
  });

  const createColumns = () => {
    return [
      ...mergedColumns,
      {
        name: 'Acciones',
        allowOverflow: true,
        minWidth: '200px',
        cell: row => {
          const editable = isEditing(row);
          if (editable) {
            return (
              <div>
              	<IconButton aria-label="save" onClick={() => save(row)}>
		          <MdSave />
		        </IconButton>

		        <IconButton aria-label="cancel" onClick={cancel}>
		        <IconContext.Provider value={{ color: "#e65b65" }}>
		          	<MdCancel />
		         </IconContext.Provider>
		        </IconButton>
              </div>
            );
          }
          return <div>
          <IconButton aria-label="download" href={urlFetch+row.song_path} target="_blank">
            <IconContext.Provider value={{ color: "#488e48" }}>
    		   		<MdFileDownload />
    		   	</IconContext.Provider>
    		  </IconButton>

          <IconButton aria-label="edit" onClick={() => edit(row)}>
          	<IconContext.Provider value={{ color: "#f7b217" }}>
    		   		<MdEdit />
    		   	</IconContext.Provider>
		      </IconButton>

          <IconButton aria-label="delete" onClick={() => deleteRow(row)}>
          	<IconContext.Provider value={{ color: "#e65b65" }}>
    		   		<MdDelete />
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
    <Grid container justify="space-between">
    <Grid item>
        <Button
          variant="contained"
          color={theme === "dark" ? "default" : "primary"}
          size="small"
          startIcon={<MdFileUpload />}
          onClick={handleAddSongDialog}
        >
          Subir alabanza
        </Button>
    </Grid>

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

    <AddSongDialog openAddSongDialog={openAddSongDialog} handleAddSongDialog={handleAddSongDialog} theme={theme} />
    <DeleteSongDialog openDeleteSongDialog={openDeleteSongDialog} handleDeleteSongDialog={handleDeleteSongDialog} theme={theme} songId={songId} />

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
        <Box>
        <Button variant="contained" style={{margin: 5}} size="small" startIcon={<FaHome />} color={theme === "dark" ? "default" : "primary"} onClick={() => history.push("/")}>
            Ir al sitio
        </Button>

        <Button variant="contained" style={{margin: 5}} size="small" startIcon={<FaSignOutAlt />} color={theme === "dark" ? "default" : "primary"} onClick={logout}>
            Cerrar sesi&oacute;n
        </Button>
        </Box>
      }
    />
    </Box>

    <Footer />

    </Grid>
  );
};

export default Dashboard