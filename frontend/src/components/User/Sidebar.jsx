import { Link } from 'react-router-dom';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Sidebar({name="Nirupam Bhattacharya"}) {
  return (
    <div className="col-3 mx-3">
      <div className='bg-light d-flex' style={{height:"4rem"}}>
        <AccountCircleIcon sx={{fontSize: 40}} className='ms-2 mt-2'/>
        <div className='ms-4'>
            <p className='m-0 p-0' style={{fontSize:"0.8rem"}}>Hello,</p>
            <p className='m-0 p-0'>{name}</p>
        </div>
      </div>
      <div className='bg-light my-3' style={{height:"60rem"}}>
        <div className='d-flex justify-content-evenly '>
        <OpenInBrowserIcon sx={{fontSize: 24}}/>
        <p className='fs-6'>MY ORDERS</p>
        <ArrowForwardIosIcon sx={{fontSize: 15}}/>
        </div>
      </div>
    </div>
  );
}