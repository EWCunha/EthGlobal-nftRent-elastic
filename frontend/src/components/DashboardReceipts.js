import React from 'react'
import { Typography, Grid, Card, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

export const DashboardReceipts = ({ asOwnerReceipts, asBorrowerReceipts }) => {

    const getDateRight = (timestamp) => {
        const strDate = (new Date(timestamp * 1000)).toISOString()
        return strDate.substring(0, 10) + " " + strDate.substring(11, 19)
    }

    return (
        <Card>
            <Typography variant="h4">Receipts</Typography>
            <Grid container style={{ display: "flex", gap: "1rem" }}>
                <Card>
                    <Typography variant="h6">As Owner</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center">Receipt CID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {asOwnerReceipts.map((cid, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{getDateRight(cid.timestamp)}</TableCell>
                                        <TableCell align="center">
                                            <Link href={"https://" + cid.cid + ".ipfs.dweb.link"} target="_blank">{cid.cid}</Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                <Card>
                    <Typography variant="h6">As Borrower</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center">Receipt CID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {asBorrowerReceipts.map((cid, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{getDateRight(cid.timestamp)}</TableCell>
                                        <TableCell align="center">
                                            <Link href={"https://" + cid.cid + ".ipfs.dweb.link"} target="_blank">{cid.cid}</Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Grid>
        </Card>
    )
}
