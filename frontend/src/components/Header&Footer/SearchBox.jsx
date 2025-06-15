import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;


 return (
  <Autocomplete
    id="animated-search-dropdown"
    freeSolo
    disableClearable
    options={products}
    inputValue={search}
    onInputChange={(event, newInputValue) => {
      setSearch(newInputValue);
    }}
    onChange={(event, value) => {
      setSearch(value);
      handleEnter(value);
    }}
    sx={{ 
      width: { xs: '100%', md: 700 },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
          transition: 'border-color 0.3s ease',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.2)',
        },
      },
      '& .MuiAutocomplete-popper': {
        animation: `${fadeIn} 200ms`,
      },
      '& .MuiAutocomplete-listbox': {
        backgroundColor: '#2c3e50',
        color: 'white',
        '& li': {
          padding: '12px 16px',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#34495e',
          },
          '&.Mui-focused': {
            backgroundColor: '#3d566e',
          },
        },
      },
      '& .MuiAutocomplete-noOptions': {
        color: 'white',
        backgroundColor: '#2c3e50',
      },
    }}
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
        sx={{
          '& .MuiInputBase-input::placeholder': {
            color: 'white',
            opacity: 1,
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: 'white',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    )}
    renderOption={(props, option) => (
      <li 
        {...props} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <MedicalInformationIcon fontSize="small" />
        <span>{option}</span>
      </li>
    )}
    componentsProps={{
      paper: {
        sx: {
          mt: 1,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    }}
  />
);
}
