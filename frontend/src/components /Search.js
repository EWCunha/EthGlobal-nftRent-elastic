import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import MockNFT from '../img/TestImage.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const Search = () => {

  const dispatch = useDispatch()
  const benefits = useSelector((state) => state.benefits)

  useEffect(() => {
    benefits.map((des) => {
      console.log(des)
    })
  },[benefits])

  const SearchResults = () => {
    return(
        benefits.map((des) => {
          return (
            <Grid container columnSpacing = { { xs:4, sm:4, md:4 } }>        
              <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            
                    <img width='50%' height='50%' src={MockNFT}/>
              
              </Grid>

              <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
                <Typography>{des}</Typography>
              </Grid>
              
              <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
              <Link to='/Rent'>
                <Button variant="contained"
                      color="success"
                >
                  Rent
                </Button>
                </Link>
            
              </Grid>
            </Grid>
          )
        }
      )
    )
  }

  return (
    
    <SearchResults/>

  )
}

export default Search