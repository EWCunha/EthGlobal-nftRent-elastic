import React, { useState } from 'react'
import { Card, Tooltip, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { copyToClipboard } from '../utils'

export const DashboardRentedCard = ({ nftsInfoRented, handleTimer }) => {
    const [elabsedTime, setElapsedTime] = useState(undefined)

    return (
        <Card>
            <h2>Rented</h2>
            {nftsInfoRented.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Item ID</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Token ID</TableCell>
                                <TableCell align="center">Collateral</TableCell>
                                <TableCell align="center">Price/day</TableCell>
                                <TableCell align="center">Benefit(s)</TableCell>
                                <TableCell align="center">Agreement</TableCell>
                                <TableCell align="center">Elapsed time</TableCell>
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
                                    <TableCell align="center">{`${nft.collateral} ETH`}</TableCell>
                                    <TableCell align="center">{`${nft.price} ETH`}</TableCell>
                                    <TableCell align="center">{nft.benefits}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Copy to Clipboard">
                                            <Chip
                                                onClick={(e) => copyToClipboard(e, nft.agreement)}
                                                label={nft.agreement.substr(0, 6) + "..." + nft.agreement.substr(nft.agreement.length - 4, nft.agreement.length)}
                                                variant="outlined"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{handleTimer(nft.startTime, nft.daysToRent)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained"
                                            color="success"
                                            disabled={handleTimer(nft.startTime, nft.daysToRent) === "00:00:00" ? false : true}
                                        >
                                            RETURN NFT
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <h3>No NFTs rented</h3>
                    <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </>
            )}
        </Card>
    )
}
