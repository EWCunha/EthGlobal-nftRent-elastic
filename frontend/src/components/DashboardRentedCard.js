import React from 'react'
import { Card, Tooltip, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { copyToClipboard } from '../utils'

export const DashboardRentedCard = ({ nftsInfo }) => {
    return (
        <Card>
            <h2>Rented</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item ID</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Token ID</TableCell>
                            <TableCell>Collateral</TableCell>
                            <TableCell>Price/day</TableCell>
                            <TableCell>Benefit(s)</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {nftsInfo.map((nft) => (
                            <TableRow
                                key={nft.itemId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {nft.itemId}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Copy to Clipboard">
                                        <Chip
                                            onClick={(e) => copyToClipboard(e, nft.nftAddress)}
                                            label={nft.nftAddress.substr(0, 6) + "..." + nft.nftAddress.substr(nft.nftAddress.length - 4, nft.nftAddress.length)}
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{nft.tokenId}</TableCell>
                                <TableCell>{`${nft.collateral} ETH`}</TableCell>
                                <TableCell>{`${nft.pricePerDay} ETH`}</TableCell>
                                <TableCell>{nft.benefits}</TableCell>
                                <TableCell>
                                    {nft.rented ? (
                                        <Button variant="contained"
                                            color="error">
                                            WITHDRAW COLLATERAL
                                        </Button>
                                    ) : (
                                        <Button variant="contained"
                                            color="success">
                                            UNLIST NFT
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}
