import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import {
  MdClose,
} from "react-icons/md";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <Box width={400} display="flex" justifyContent="flex-end">
    <TextField
      id="search"
      type="text"
      placeholder="Buscar..."
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      style={{
        width: '100%',
      }}
    />
    <IconButton aria-label="delete" onClick={onClear}>
      <MdClose />
    </IconButton>
  </Box>
);

export {
  FilterComponent
}