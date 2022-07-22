import React from 'react'
import { Typography, Box, Card, CardHeader, CardContent, Grid } from '@mui/material'
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import { ethers } from 'ethers';

const ReceiptPDF = ({ receipt }) => {

    const margin_left = ""
    const margin_left_titles = "10rem"
    const variantType = "h6"

    const getDateRight = (timestamp) => {
        const strDate = (new Date(timestamp * 1000)).toISOString()
        return strDate.substring(0, 10) + " " + strDate.substring(11, 19)
    }

    return (
        <Grid>
            <Box>

            </Box>
            <Box sx={{ p: 0.5, marginTop: 1, display: "block" }}>
                <Card variant="elevation" >
                    <CardHeader title="RECEIPT" sx={{ display: "flex", justifyContent: "flex-start", marginLeft: "12rem" }} />
                    <CardContent>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}              >
                            Owner: {receipt ? receipt.owner : ethers.constants.AddressZero}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Borrower: {receipt ? receipt.owner : ethers.constants.AddressZero}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Agreement: {receipt ? receipt.agreement : ethers.constants.AddressZero}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            NFT Address: {receipt ? receipt.nftAddress : ethers.constants.AddressZero}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            NFT Token ID: {receipt ? receipt.tokenId : "None"}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Elastic Item ID: {receipt ? receipt.itemId : "None"}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Collateral Price: {receipt ? receipt.collateral : "--"} ETH
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Rental Price: {receipt ? receipt.NFTPrice : "--"} ETH/day
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Rental Start Date/Time: {receipt ? getDateRight(receipt.startTime) : "YYYY-MM-DD HH:MM:SS"}
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Proposed Rental Period: {receipt ? receipt.rentTime : "--"} seconds
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Actual Rental Period: {receipt ? receipt.timestamp - receipt.startTime : "--"} seconds
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left }}               >
                            Paid Amount: {receipt ? receipt.PaidAmount : "--"} ETH
                        </Typography>
                        <Typography variant={variantType} sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left, marginBottom: "2rem" }}               >
                            Rental End: {receipt ? receipt.status : "None"}
                        </Typography>
                        <Grid container sx={{ display: "flex", justifyContent: "flex-start", marginLeft: margin_left_titles }}>
                            <ThreeSixtyIcon sx={{ color: 'black', fontSize: '200%' }} />
                            <Typography variant="h4" color="black">
                                Elastic
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
}

export default ReceiptPDF