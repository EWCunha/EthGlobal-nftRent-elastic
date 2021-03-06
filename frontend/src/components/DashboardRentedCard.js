import React from 'react'
import {
    Card, Tooltip, Chip, Button, Table, TableBody, TableCell, Box,
    TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress
} from '@mui/material'
import { copyToClipboard, roundDecimal } from '../utils'

export const DashboardRentedCard = ({ nftsInfoRented, handleTimer, time, returnNFT, progress }) => {

    function CircularProgressWithLabel(props) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.primary">
                        {`${props.value}`}
                    </Typography>
                </Box>
            </Box>
        );
    }

    const totalPayment = (startTime, price) => {
        const runnedTime = time / 1000 - startTime
        // console.log(runnedTime * price, time, startTime, isNaN(runnedTime * price))
        return isNaN(runnedTime * price) ? 0 : (runnedTime * price <= 1e-6 ? 0 : runnedTime * price)
    }

    return (
        <Card sx={{ paddingLeft: 2, paddingRight: 2, width: "100%" }}>
            <Typography variant="h4">Rented NFTs</Typography>

            {nftsInfoRented.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: "lightgray" }}>
                                <TableCell align="center">Item ID</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Token ID</TableCell>
                                <TableCell align="center">Collateral (ETH)</TableCell>
                                <TableCell align="center">Price/day (ETH)</TableCell>
                                <TableCell align="center">Benefit(s)</TableCell>
                                <TableCell align="center">Agreement</TableCell>
                                <TableCell align="center">Elapsed time</TableCell>
                                <TableCell align="center">Total payment (ETH)</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nftsInfoRented.map((nft) => (
                                <TableRow
                                    key={nft.itemId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        {nft.itemId}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Copy to Clipboard">
                                            <Chip
                                                onClick={(e) => copyToClipboard(e, nft.nftAddress)}
                                                label={nft.nftAddress.substr(0, 6) + "..." + nft.nftAddress.substr(nft.nftAddress.length - 4, nft.nftAddress.length)}
                                                variant="outlined"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{nft.tokenId}</TableCell>
                                    <TableCell align="center">{nft.collateral}</TableCell>
                                    <TableCell align="center">{roundDecimal(nft.price * 24 * 60 * 60, 5)}</TableCell>
                                    <TableCell align="center">{nft.benefits}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Copy to Clipboard">
                                            <Chip
                                                onClick={(e) => copyToClipboard(e, nft.agreementAddress)}
                                                label={nft.agreementAddress.substr(0, 6) + "..." + nft.agreementAddress.substr(nft.agreementAddress.length - 4, nft.agreementAddress.length)}
                                                variant="outlined"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{handleTimer(nft.startTime, nft.rentTime)}</TableCell>
                                    <TableCell align="center">{roundDecimal(totalPayment(nft.startTime, nft.price), 5)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained"
                                            color="success"
                                            onClick={e => returnNFT(e, nft.agreementAddress, nft.nftAddress, roundDecimal(totalPayment(nft.startTime, nft.price), 5))}
                                        >
                                            {progress > 0 ? (
                                                <CircularProgressWithLabel color="secondary" value={`${progress}/2`} />
                                            ) : "RETURN NFT"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Item ID</TableCell>
                                    <TableCell align="center">Address</TableCell>
                                    <TableCell align="center">Token ID</TableCell>
                                    <TableCell align="center">Collateral (ETH)</TableCell>
                                    <TableCell align="center">Price/day (ETH)</TableCell>
                                    <TableCell align="center">Benefit(s)</TableCell>
                                    <TableCell align="center">Agreement</TableCell>
                                    <TableCell align="center">Elapsed time</TableCell>
                                    <TableCell align="center">Total payment</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Card>
    )
}
