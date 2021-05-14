import Avatar from '@material-ui/core/Avatar';
import {
  MdImage,
  MdVolumeUp,
  MdPictureAsPdf,
  MdMusicNote,
  MdVideocam,
  MdHelpOutline
} from "react-icons/md";
import {
  FaFileWord,
  FaFileAlt,
  FaFileArchive
} from "react-icons/fa";
import {
  SiMidi
} from "react-icons/si";
import {
  RiNeteaseCloudMusicLine
} from "react-icons/ri";
import { formatBytes } from './../../Parts/fileSizeText'
import Typography from "@material-ui/core/Typography";
import { TimeSince } from './../../Parts/timeAgoFunction'

function intersperse(arr, sep) {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(function(xs, x, i) {
        return xs.concat([sep, x]);
    }, [arr[0]]);
}

const columns = [
	{
      name: "",
      selector: "file_type",
      width: "3%",
      hide: 'sm',
      cell: (row) => {
      	if (row.file_type.toLowerCase() === "png" || row.file_type.toLowerCase() === "jpg" || row.file_type.toLowerCase() === "jpng") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#1183ca' }}>
			        <MdImage />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "rar" || row.file_type.toLowerCase() === "zip") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#885ca7', color: '#fff' }}>
			        <FaFileArchive />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "mp3" || row.file_type.toLowerCase() === "wma" || row.file_type.toLowerCase() === "wav" || row.file_type.toLowerCase() === "aac" || row.file_type.toLowerCase() === "m4a" || row.file_type.toLowerCase() === "ogg") {
      		return <Avatar style={{ width: 30, height: 30, color: '#000' }}>
			        <MdVolumeUp />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "pdf") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#fc3b3c' }}>
			        <MdPictureAsPdf />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "doc" || row.file_type.toLowerCase() === "docx") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#285291', color: '#fff' }}>
			        <FaFileWord />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "midi" || row.file_type.toLowerCase() === "mid") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#fff', color: '#000' }}>
			        <SiMidi />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "enc") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#fff', color: '#000' }}>
			        <MdMusicNote />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "mp4" || row.file_type.toLowerCase() === "mkv" || row.file_type.toLowerCase() === "flv" || row.file_type.toLowerCase() === "avi" || row.file_type.toLowerCase() === "mpeg" || row.file_type.toLowerCase() === "3gp") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#2b87f7', color: '#fff' }}>
			        <MdVideocam />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "sib") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#3f1f88', color: '#fff' }}>
			        <RiNeteaseCloudMusicLine />
			      </Avatar>
      	}else if (row.file_type.toLowerCase() === "txt") {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#d2dde1', color: '#131e36' }}>
			        <FaFileAlt />
			      </Avatar>
      	}else {
      		return <Avatar style={{ width: 30, height: 30, backgroundColor: '#fff', color: 'gray' }}>
			        <MdHelpOutline />
			      </Avatar>
      	}
      }
    },
  	{
      name: "Nombre",
      selector: "song_name",
      sortable: true,
      editable: true,
      compact: true
    },
    {
      name: "Tipo",
      selector: "file_type",
      sortable: true,
      maxWidth: "10%",
      compact: true,
    },
    {
      name: "Tamaño",
      selector: "file_size",
      sortable: true,
      maxWidth: "10%",
      compact: true,
      cell: (row) => {
      	return formatBytes(row.file_size)
      }
    },
    {
      name: "Publicado",
      selector: "song_published_date",
      sortable: true,
      wrap: true,
      maxWidth: "15%",
      compact: true,
      type: "datetime",
      cell: (row) => {
      	return TimeSince(row.song_published_date);
      }
    },
    {
      name: "Editado",
      selector: "last_edit_date",
      sortable: true,
      wrap: true,
      maxWidth: "15%",
      compact: true,
      type: "datetime",
      cell: (row) => {
        return TimeSince(row.last_edit_date);
      }
    },
    {
      name: "Idioma",
      selector: "language_name",
      sortable: true,
      maxWidth: "10%",
      compact: true,
      editable: true,
    },
    {
      name: "Categorías",
      selector: "categories",
      sortable: true,
      maxWidth: "15%",
      editable: true,
      compact: true,
      wrap: true,
      cell: (row) => {
      	const categories = row.categories.map((res, i) => {
            return (
              <Typography key={i} variant="caption">
                {res["category_name"]}
              </Typography>
            );
          })
        return <div
          style={{
            flex: 1,
            flexWrap: "wrap",
          }}
        >
          {intersperse(categories, ", ")}
        </div>
      },
    },
    {
      name: "Usuario",
      selector: "user_name",
      sortable: true,
      wrap: true,
      maxWidth: "15%",
    }
];

export {
  columns
}