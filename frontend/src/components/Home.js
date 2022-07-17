import React from 'react'
import {  Box, Typography, Card, CardMedia, CardHeader, CardContent, ListItemText,List,ListItem, ListItemIcon} from "@mui/material"
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HandymanIcon from '@mui/icons-material/Handyman';
import ComputerIcon from '@mui/icons-material/Computer';
import SearchIcon from '@mui/icons-material/Search';
import SavingsIcon from '@mui/icons-material/Savings';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const Home = () => {
  return (
    <>
      <Card sx={{marginTop:2}} variant="outlined">
        <Box>
        <Typography sx={{fontSize:20,marginTop:1}}>Welcome To Elastic!</Typography>
        <SavingsIcon sx={{fontSize:'500%',marginTop:4}} color="primary"/>     
        </Box>

        <Box sx={{p:0.5,marginTop:1, display:"block"}}>
        <Card variant="elevation">
        <CardHeader title="ABOUT"/> 
  <CardContent>
<Typography>
  PiggiFund is a crypto fundraising platform for the masses. Use the PiggiFund Maker to mint a fundraising contract
  and share out the resulting address, along with the PiggiFund UI, to kick-start your fundraising campaign! 
</Typography>
</CardContent>
          </Card>
          </Box>


<Box sx={{p:0.5,marginTop:1, display:"block"}}>
<Card variant="elevation">
<CardHeader title="THE PROTOCOL"/> 
<CardContent>
<List>
    <ListItem>
      <ListItemIcon>
    <EmojiEventsIcon/>
      </ListItemIcon>
      <ListItemText>
  The fundraiser sets a contract goal. Funds can be donated towards the goal until met or the refund period arrives. If the funding goal is met 
  no more contributions can be made to the campaign and the fundraiser is allowed to withdraw all funds.
      </ListItemText>   
    </ListItem>


    <ListItem>
      <ListItemIcon>
<KeyboardReturnIcon/>
      </ListItemIcon>
      <ListItemText>
A refund period is set by the fundraiser which signals the end of a fundraising campaign without the fundraising goal having been met. 
Doners have the option of getting a refund on their contribution via the PiggiFund UI. The fundraier is not able to withdraw donations yet. 
Doners are still able to make contributions.
      </ListItemText>   
    </ListItem>


    <ListItem>
      <ListItemIcon>
<HandshakeIcon/>
      </ListItemIcon>
      <ListItemText>
A claim period is set by the fundraiser signaling the end of when doners can get a refund. During this period, even though the fundraising goal
has not been met, the fundraiser is allowed to withdraw all donations within the contract.
      </ListItemText>   
    </ListItem>


    <ListItem>
      <ListItemIcon>
<MilitaryTechIcon/>
      </ListItemIcon>
      <ListItemText>
The address of the doner whose contribution pushes the fundraising campaign into the target is recorded as the "Golden Doner" on the contract. This address can be used
for purposes like sending an token based award- like an NFT.
      </ListItemText>   
    </ListItem>

  </List>
</CardContent>
          </Card>
</Box>


<Card variant="outlined">
<CardHeader title="THE TOOLS"/>
<Box sx={{p:0.5,display:'inline-block', width:1/3}}>
  <Card sx={{height:'45vw'}}variant="outlined">
      <CardHeader title="PiggiFund Maker"/>
      <CardContent>
     
        <Typography>
        Use the PiggiFund Maker to deploy your own Solidity smart-contract. Set your funding goal, campaign description, refund period and claim period and house this 
      information transparently and securely, on chain. 
        </Typography>
       
       <HandymanIcon sx={{fontSize:'900%',marginTop:2}} color="primary"/>
       
      </CardContent>
    </Card>
  </Box>

  <Box sx={{p:0.5,display:'inline-block', width:1/3}}>
  <Card sx={{height:'45vw'}} variant="outlined">
      <CardHeader title="PiggiFund UI"/>
      <CardContent>
       <Typography>
    Visualize and make deposits/withdraws into a PiggiFund contract using the PiggiFund UI. The innovative system detects the user's MetaMask address
    and will conditionaly render buttons avaiable for deposit, refund or withdraw depending on who the user is and what time period the fundraising 
    campaign is in.
       </Typography>
       <ComputerIcon sx={{fontSize:'900%',marginTop:2}} color="primary"/>
      
      </CardContent>
    </Card>
</Box>

<Box sx={{p:0.5,display:'inline-block', width:1/3}}>
<Card  sx={{height:'45vw'}} variant="outlined">
      <CardHeader title="PiggiFund Contracts"/>
      <CardContent>
        <Typography>
          Search through PiggiFund contracts and grab an interesting contract address to visit 
          through the PiggiFund UI
        </Typography>
        <SearchIcon  sx={{fontSize:'900%',marginTop:4}} color="primary"/>
      
      </CardContent>
    </Card>
</Box>


</Card>

  




      </Card>
  
    
    
    </>
  )
}

export default Home