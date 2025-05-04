import React from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function LeftSidebar({title="medicineName",description="des",price="24000" , image="media/headerImg/img1.png"}) {
    return (
        <div class="bg-light">
            <div class="row g-0 my-1">
                <div class="col-md-4 my-2">
                    <img src={image} class="img-fluid rounded-start" alt="..." style={{height:"9rem", width:"10rem"}}/>
                </div>
                <div class="col-md-8 my-3">
                    <div class="card-body">
                        <h5 class="card-title">{title}</h5>
                        <p class="card-text">{description}</p>
                        <p class="card-text">₹{price}</p>
                        <Stack direction="row" spacing={2}>
                        <Button variant='contained' color='secondary'>Remove</Button>
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    )
}
