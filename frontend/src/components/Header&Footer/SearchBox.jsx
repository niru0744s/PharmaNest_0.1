import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';

export default function SearchBox() {
  const [search , setSearch] = useState("");

  const handleInput = async(e , inputValue)=>{
    e.preventDefault();
    setSearch(inputValue);
  }

  const handleEnter = (e , inputValue)=>{
    if(e.key === "Enter"){
      console.log(inputValue);
    }
  }


  return (
    <Autocomplete
      disablePortal
      freeSolo
      options={top100Films}
      getOptionLabel={(option) => option.title}
      popupIcon={null}
      sx={{ width: { xs: '50%', md: 800 } }}
      size='small'
      inputValue={search}
      onInputChange={handleInput}
      onKeyDown={handleEnter}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder='Search for Medicines , Equipments and More'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    }
  ]


