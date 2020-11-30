import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import eventImg from '../images/event.jpg'
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";

import { useMutation, gql,useQuery } from "@apollo/client";
import { Container } from "@material-ui/core";


const GET_USER_BOOKING = gql`
  query userBookings {
    userBookings {
        _id  
        event {
          _id 
          title
          description
          price
          date
        }
      
    }
  }
`;

const CANCEL_BOOKING = gql`
  mutation cancelBooking($bookingId : ID) {
    cancelBooking(bookingId: $bookingId) {
        _id  
        title
        description
        price
        date
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  //   root: {
  //     minWidth: 275,
  //   },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media:{
    height:200
  },
  avatar: {
    width:theme.spacing(3),
    height:theme.spacing(3),

  },
}));

export default function BookedEvents(props) {
  const classes = useStyles();
  const {data,refetch} = useQuery(GET_USER_BOOKING, {
    onCompleted: (data) => {
    //  console.log("data", data);
      
    },
    onError: (error) => {
     console.log(error)
    },
  });
  const [cancelBooking] = useMutation(CANCEL_BOOKING,{
    onCompleted:(data) =>{
      refetch()
    },
    onError : (err) =>{

    }
  })

  const handleCancelBooking = (id) =>{
    cancelBooking({
      variables:{
        bookingId:id
      }
    })
  }

  useEffect(()=>{
      refetch()
  },[])
  

  return (
    <Container  maxWidth="lg"> 
    <Grid container spacing={2} >
      {data &&
        data.userBookings.map((item, index) => {
          const event = item.event
          return (
            <Grid item xs={12} sm={6} md={4} key={index} >
              <Card   >
              <CardMedia
          className={classes.media}
          image={eventImg}
          title={event.title}
        />
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {event.description}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Price: ${event.price}`}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`Date: ${new Date(Number(event.date)).toDateString()} ${new Date(
                      Number(event.date)
                    ).toLocaleTimeString()} `}
                  </Typography>
                </CardContent>
                <CardActions>
                 
                  <Button variant="outlined" color="secondary" size="small" onClick={()=>handleCancelBooking(item._id)}>
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
    </Grid>
    </Container>
  );
}
