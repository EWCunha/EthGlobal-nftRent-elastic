import React from 'react'
import {Box, Typography, Card,CardHeader, CardContent, ListItemText,List,ListItem, ListItemIcon} from "@mui/material"
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HandymanIcon from '@mui/icons-material/Handyman';
import ComputerIcon from '@mui/icons-material/Computer';
import SearchIcon from '@mui/icons-material/Search';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';

const Home = () => {
  return (
    <>
    <Box sx={{ margin: 0, padding: 0, minHeight: "100%", position: "relative" }}>
  <Card sx={{marginTop:2}} variant="outlined">
<center>
<Box>
        <Typography sx={{fontSize:25,marginTop:1}}>Welcome To Elastic!</Typography>
        <ThreeSixtyIcon sx={{fontSize:'500%',marginTop:4}} color="primary"/>     
  </Box>



<Box sx={{p:0.5,marginTop:1, display:"block"}}>
  <Card variant="elevation">
  <CardHeader title="ABOUT"/> 
  <CardContent>
<Typography>
  Elastic is a platform and search engine for renting and searching NFTs by their benefits provided to the owner. 
</Typography>
  </CardContent>
    </Card>
</Box>
</center>

<Box sx={{p:0.5,marginTop:1, display:"block"}}>
<Card variant="elevation">
<center>
<CardHeader title="THE PROTOCOL"/> 
</center>
<CardContent>
<List>
    <ListItem>
      <ListItemIcon>
    <EmojiEventsIcon sx={{color:"red", fontSize:'200%'}}/>
      </ListItemIcon>
      <ListItemText>
List any ERC721 NFT, set rent you'd like per day and the collateral needed to be deposited to enter into a rental period. Highlight the benefits afforded someone from renting your NFT.
      </ListItemText>   
    </ListItem>


    <ListItem>
      <ListItemIcon>
<KeyboardReturnIcon sx={{color:"red", fontSize:'200%'}}/>
      </ListItemIcon>
      <ListItemText>
When a rental period ends the rentee pays back the amount owed and communication about extensions to the rental period or days to pay back can be negotiated by way of XMTP through our dashboard.   
      </ListItemText>   
    </ListItem>

    <ListItem>
      <ListItemIcon>
<HandshakeIcon sx={{color:"red", fontSize:'200%'}}/>
      </ListItemIcon>
      <ListItemText>
If the rentee fails to pay the agreed upon amount or they do not return the NFT, the lister has the option of withdrawing the collateral amount.
      </ListItemText>   
    </ListItem>

    <ListItem>
      <ListItemIcon>
<MilitaryTechIcon sx={{color:"red", fontSize:'200%'}}/>
      </ListItemIcon>
      <ListItemText>
Upon each successful return of an NFT rental the rentee will recieve a POAP as a form of social credit for their rent trustworthyness.
      </ListItemText>   
    </ListItem>
  </List>
</CardContent>

</Card>
</Box>


<Card variant="outlined">
<center>
<CardHeader sx={{marginBottom:2}} title="THE TOOLS"/>
</center>

<Box sx={{p:0.5,display:'inline-block', width:1/3}}>
  <Card sx={{height:'45vw'}}variant="outlined">
    <center>
    <CardHeader title="Elastic List"/>  
      <CardContent>
        <Typography>
Use the List tab to place your NFT on the Elastic rental marketplace. 
        </Typography>
       <HandymanIcon sx={{fontSize:'900%',marginTop:2}} color="primary"/>
      </CardContent>
      </center>
    </Card>
  </Box>

  <Box sx={{p:0.5,display:'inline-block', width:1/3}}>
  <Card sx={{height:'45vw'}} variant="outlined">
    <center>
      <CardHeader title="Elastic Dashboard"/>
      <CardContent>
       <Typography>
Use the Dashboard to track the NFTs you have listed on the Elastic marketplace as well as the rental agreements entered into.
       </Typography>
       <ComputerIcon sx={{fontSize:'900%',marginTop:2}} color="primary"/>
      </CardContent>
      </center>
    </Card>
</Box>

<Box sx={{p:0.5,display:'inline-block', width:1/3}}>
<Card  sx={{height:'45vw'}} variant="outlined">
  <center>
      <CardHeader title="Elastic Search"/>
      <CardContent>
        <Typography>
Search NFTs by their benefits afforded by a rental and enter into new rental agreements from this tab.
        </Typography>
        <SearchIcon  sx={{fontSize:'900%',marginTop:4}} color="primary"/>
      </CardContent>
  </center>
    </Card>
</Box>
</Card>

      </Card> 
      </Box>
    </>
  )
}

export default Home