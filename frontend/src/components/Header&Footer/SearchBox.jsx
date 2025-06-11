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
  const products = categories.flatMap((category) =>
  category.products.map((item) => item.name)
);
  const navigate = useNavigate();
  const handleEnter = (matched) => {
    const allProducts = categories.flatMap((category) => category.products);
    const id= allProducts.find((item) => item.name === matched)?._id || null;
    navigate(`/show/${id}`);
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
  }}
  onChange={(event, value) => {
    // Handles mouse click or option selection
    setSearch(value); // update the input with selected value
    handleEnter(value);
  }}
  sx={{ width: { xs: '100%', md: 700 } }}
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
      placeholder="Search"
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
