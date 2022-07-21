import React from 'react'
import { Card, Tooltip, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { copyToClipboard, roundDecimal } from '../utils'

export const DashboardOwnedCard = ({ nftsInfoOwned, handleTimer, unlistNFT, withdrawCollateral }) => {
    return (
        <Card sx={{ paddingLeft: 2, paddingRight: 2, width: "100%" }}>
            <h2>Listed NFTs</h2>
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
                            {nftsInfoOwned.length > 0 && nftsInfoOwned.filter(el => el.rented).length > 0 ? (
                                <>
                                    <TableCell align="center">Agreement</TableCell>
                                    <TableCell align="center">Elapsed time</TableCell>
                                    <TableCell align="center"></TableCell>
                                </>
                            ) : (
                                <TableCell align="center"></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {nftsInfoOwned.length > 0 ? (nftsInfoOwned.map((nft) => (
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
                                {nft.rented ? (
                                    <>
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
                                    </>
                                ) : nftsInfoOwned.length > 0 && nftsInfoOwned.filter(el => el.rented).length > 0 ? (
                                    <>
                                        <TableCell align="center">--</TableCell>
                                        <TableCell align="center">--</TableCell>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <TableCell align="center">
                                    {nft.rented ? (
                                        <Button variant="contained"
                                            color="error"
                                            disabled={handleTimer(nft.startTime, nft.rentTime) === "00:00:00" ? false : true}
                                            onClick={e => withdrawCollateral(e, nft.agreementAddress)}
                                        >
                                            WITHDRAW COLLATERAL
                                        </Button>
                                    ) : (
                                        <Button variant="contained"
                                            color="success"
                                            onClick={e => unlistNFT(e, nft.itemId)}
                                        >
                                            UNLIST NFT
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}
