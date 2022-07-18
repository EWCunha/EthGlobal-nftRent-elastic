import React, { useState } from 'react'
import {
  TextField,
  Button,
  Modal,
  Box
} from '@mui/material'

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

const RentalModal = ({ open, handleClose, handleRentalDays, completeRental }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={e => handleClose(e)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>How many days to rent?</div>
          <TextField onChange={(e) => handleRentalDays(e, e.target.value)}></TextField>
          <Button
            variant="contained"
            onClick={e => completeRental(e)}
          >COMPLETE RENTAL</Button>
        </Box>


      </Modal>
    </>
  )

}

export default RentalModal