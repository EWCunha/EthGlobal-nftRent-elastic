import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Button, 
  Typography,  
  Grid, 
  TablePagination,
  TableContainer, 
  TableHead, 
  Table, 
  TableRow, 
  TableCell, 
  TableBody,
  Card,
  TextField,
  Tab,
  Modal,
  } from '@mui/material'
  import { ethers } from 'ethers'

import { useSelector, useDispatch } from 'react-redux'
import ElasticContractBuilder from '../contracts/Elastic.json'
import { logEventData } from '../utils'
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

  const nftData = useSelector((state) => state.nftData)
  const contract = useSelector((state)=>state.contract)
  const provider = useSelector(state => state.provider)

  const [data,setData] = useState(null)
  const [page,setPage] = useState(0)
  const [rowsPerPage,setRowsPerPage] = useState(5)
  const [searchwords,setSearchWords] = useState("")

  const [rentdays, setRentDays] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [itemSelect,setItemSelect] = useState(null)
  const [collateralSelect,setCollateralSelect] = useState(null)

  const [listedNFTs, setListedNFTs] = useState([])

  useEffect(() => {
    if (provider && ElasticContractBuilder.address) {
      logEventData("NFTListed", [], provider, setListedNFTs)
    }
  }, [])


const repackageData = ()=>{
  const container = []
  if(nftData){
  nftData.forEach((item)=>{
    let simplifiedItem = {}
    simplifiedItem["itemId"]= item[1].toNumber()
    simplifiedItem["itemURI"] = item[2]
    simplifiedItem["itemDescription"] = item[4]
    simplifiedItem["collateral"] = parseFloat(ethers.utils.formatEther(item[5]))
    // console.log(typeof(ethers.utils.formatEther(item[5])))
    simplifiedItem["price"] = parseFloat(ethers.utils.formatEther(item[6]))
    container.push(simplifiedItem)
  })
  return container
}
}

// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

const handleChangePage = (event,newPage)=>{
  setPage(newPage);
}

const handleChangeRowsPerPage = (event)=>{
  setRowsPerPage(parseInt(event.target.value,10))
  setPage(0)
}

const handleModalOpen = (e,select,collateral)=>{
  e.preventDefault()
  setCollateralSelect(collateral)
  setItemSelect(select)
  setOpenModal(true)
}

const handleClose=()=>{
  setItemSelect(null)
  setOpenModal(false)
}

const handleRentalDays = (value)=>{
  console.log(value)
  setRentDays(value)
}

const completeRental = ()=>{
  // console.log("item select",typeof(itemSelect))
  // console.log("rent days",typeof(rentdays))
  let numDays = parseInt(rentdays)
  let collateralFloat = parseInt(collateralSelect)
  // console.log(parseInt(collateralSelect))
  const weiCollateral = ethers.utils.parseEther(collateralSelect.toString())
  console.log("wei",parseInt(weiCollateral))
  contract.rent(itemSelect,numDays,{value:weiCollateral})
}

const RenderedData = ()=>{
  const data = repackageData()
  // console.log("data",data)
  return(
  <Card sx={{height:'45vw'}} variant="outlined">               
    <TableContainer>
                   <Table sx={{ minWidth: 650,marginTop:2}} aria-label="simple table">
                       <TableHead sx={{backgroundColor:"lightyellow"}}>
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
               {
                       data?(
                    data.slice(0).reverse().slice(page * rowsPerPage, page*rowsPerPage+rowsPerPage).map((item)=>{
                      
                      // let ethCollateral = ethers.utils.parseEther(item.collateral.toString())
                      // console.log(parseInt(ethCollateral))
                
                           return(
                           <TableRow key={item.itemId}>
                               <TableCell>{item.itemId}</TableCell> 
                               <TableCell align="center">{item.itemURI}</TableCell> 
                               <TableCell align="center">{item.itemDescription}</TableCell>
                               <TableCell align="center">{item.collateral}</TableCell>
                               <TableCell align="center">{item.price}</TableCell>
                               <TableCell> <Button variant="contained" color="success" onClick={(e)=>handleModalOpen(e,item.itemId, item.collateral)}>RENT</Button> </TableCell>   
                           </TableRow> )
               })
    
               )
               :null
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
               {
                   data ?
               <TablePagination
             rowsPerPageOptions={[5]}
             component="div"
             count={data.length}
             rowsPerPage={rowsPerPage}
             page={page}
             onPageChange={handleChangePage}
             onRowsPerPageChange={handleChangeRowsPerPage}
           />:null
               }
               
               </Card>
              
  )
}

  return (
    <>
  <RentalModal 
  open={openModal} 
  handleClose={handleClose} 
  handleRentalDays={handleRentalDays}
  completeRental={completeRental}/>
   <RenderedData/>
    </>
 

  )
}

export default Search