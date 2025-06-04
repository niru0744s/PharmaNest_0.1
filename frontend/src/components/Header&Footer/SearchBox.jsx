import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [search , setSearch] = useState("");
  const { categories, loading, error } = useSelector((state) => state.data);
  const products = categories.map((e)=>{
  return e.category
  });
  const navigate = useNavigate();
  const handleInput = (e, newInputValue) => {
    e.preventDefault();
    console.log(newInputValue);
    setSearch(newInputValue);
};


  const handleEnter = (matched) => {
    console.log(matched);
    navigate(`/search/${matched}`);
};


  return (
    <Autocomplete
  id="free-solo-demo"
  freeSolo
  disableClearable
  options={products}
  inputValue={search}
  onInputChange={(event, newInputValue) => {
    setSearch(newInputValue);
    console.log("Typed:", newInputValue);
  }}
  onChange={(event, value) => {
    // Handles mouse click or option selection
    setSearch(value); // update the input with selected value
    handleEnter(value);
  }}
  sx={{ width: { xs: '50%', md: 800 } }}
  size="small"
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter(search);
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Search for Medicines, Equipments and More"
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
/>);
}
