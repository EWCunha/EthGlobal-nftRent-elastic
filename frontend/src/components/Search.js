import React, { useEffect, useState } from 'react'
import {
  Button,
  TablePagination,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material'
import { ethers } from 'ethers'
import SearchIcon from '@mui/icons-material/Search'

import { useSelector,useDispatch } from 'react-redux'
import { roundDecimal, filterListedUnlistedEventsData, filterRentedReturnedEventsData, filterAvailableItems } from '../utils'
import RentalModal from './RentalModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const Search = () => {
  const dispatch = useDispatch()
  const nftListed = useSelector((state) => state.nftListed)
  const nftUnlisted = useSelector((state) => state.nftUnlisted)
  const nftRented = useSelector((state) => state.nftRented)
  const nftReturned = useSelector((state) => state.nftReturned)
  const nftRemoved = useSelector((state) => state.nftRemoved)
  const contract = useSelector((state) => state.contract)
  const defaultAccount = useSelector((state) => state.defaultAccount)
  const refresher = useSelector((state) => state.refresher)
 
  const searchword = useSelector(state=>state.word)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [rentdays, setRentDays] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [itemSelect, setItemSelect] = useState(null)
  const [collateralSelect, setCollateralSelect] = useState(null)
  const [word, setWord] = useState("")
  const [NFTsAvailable, setNFTsAvailable] = useState([])

  const handleSearchTable = async () => {
    let stillListedNFTs = filterListedUnlistedEventsData(nftListed, nftUnlisted)
    stillListedNFTs = filterListedUnlistedEventsData(stillListedNFTs, nftRemoved)
    const balanceNFTs = filterRentedReturnedEventsData(nftRented, nftReturned)
    const availableNFTs = filterAvailableItems(stillListedNFTs, balanceNFTs)
    setNFTsAvailable(availableNFTs)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - NFTsAvailable.length) : 0;

  const handleChangePage = (evt, newPage) => {
    evt.preventDefault()
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (evt) => {
    evt.preventDefault()
    setRowsPerPage(parseInt(evt.target.value, 10))
    setPage(0)
  }

  const handleModalOpen = (evt, select, collateral) => {
    evt.preventDefault()
    setCollateralSelect(collateral)
    setItemSelect(select)
    setOpenModal(true)
  }

  const handleClose = (evt) => {
    evt.preventDefault()
    setItemSelect(null)
    setOpenModal(false)
  }

  const handleRentalDays = (evt, value) => {
    evt.preventDefault()
    setRentDays(parseFloat(value))
  }

  const completeRental = (evt) => {
    evt.preventDefault()
    const rentTime = roundDecimal(parseFloat(rentdays) * 24 * 60 * 60, 0)
    const weiCollateral = ethers.utils.parseEther(collateralSelect.toString())
    contract.rent(itemSelect, rentTime, { value: weiCollateral })
  }

  useEffect(() => {
    if (nftListed && nftUnlisted && nftRented && nftReturned && nftRemoved) {
      handleSearchTable()
    }
  }, [nftListed, nftUnlisted, nftRented, nftReturned, nftRemoved, refresher])




  const filterData = (dataObj)=>{
    if(dataObj.length !== 0 && searchword){
      console.log("searchword",searchword)
      console.log(dataObj.forEach(item=>console.log(item.benefitsClearText)))
      const filteredData= dataObj.filter(d => {return d.benefitsClearText.toUpperCase().includes(searchword.toUpperCase())})
      console.log("originalData", dataObj)
      console.log("filteredData",filteredData)
      return filteredData
    }
    else{
      return dataObj
    }
  }

  const submitWord=()=>{
    dispatch({type:'SET_SEARCH_WORD',payload:document.getElementById("search-field-with-icon").value})
  }

  const clearSearch=()=>{
    dispatch({type:'SET_SEARCH_WORD',payload:""})
  }

  const RenderedData = () => {
    return (
      <Card sx={{ minHeight: '45vw' }} variant="outlined">
        <TextField
          label="Search NFTs By Benefits"
          variant="outlined"
          id="search-field-with-icon"
          sx={{ marginTop: 2}}
          placeholder={searchword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Box>
        <Button variant="contained" onClick={submitWord}>SEARCH</Button>
        <Button variant="contained" color="warning" onClick={clearSearch}>CLEAR SEARCH</Button>
        </Box>
     
        <TableContainer>
          <Table sx={{ minWidth: 650, marginTop: 2 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "lightyellow" }}>
              <TableRow>
                <TableCell align="center">ItemID</TableCell>
                <TableCell align="center">ItemURI</TableCell>
                <TableCell align="center">Rental Benefits Description</TableCell>
                <TableCell align="center">Collateral (ETH)</TableCell>
                <TableCell align="center">Price (ETH)</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {NFTsAvailable.length > 0 ? (filterData(NFTsAvailable).slice().reverse().map((item) => {
                return (
                  <TableRow key={item.itemId}>
                    <TableCell align="center">{item.itemId}</TableCell>
                    <TableCell align="center">{item.tokenURI ? item.tokenURI : "--"}</TableCell>
                    <TableCell align="center">{item.benefitsClearText}</TableCell>
                    <TableCell align="center" >{item.collateral}</TableCell>
                    <TableCell align="center">{roundDecimal(item.price * 24 * 60 * 60, 5)}</TableCell>
                    <TableCell>
                      {defaultAccount ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={(e) => handleModalOpen(e, item.itemId, item.collateral)}
                          disabled={item.owner.toLowerCase() === defaultAccount ? true : false}
                        >
                          RENT
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="warning"
                        >
                          CONNECT WALLET
                        </Button>
                      )}

                    </TableCell>
                  </TableRow>)
              })
              )
                : null
              }
              
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {
          NFTsAvailable.length > 0 ?
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={NFTsAvailable.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> : null
        } */}
      </Card>
    )
  }

  return (
    <>
      <RentalModal
        open={openModal}
        handleClose={handleClose}
        handleRentalDays={handleRentalDays}
        completeRental={completeRental} />
      <RenderedData />
    </>
  )
}

export default Search