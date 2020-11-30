import React from "react";
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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Avatar from "@material-ui/core/Avatar";

const CREATE_BOOKING = gql`
  mutation createBooking($id:ID!) {
    bookEvent(eventId:$id ) {
      _id
      event{
        title
        description
        price
        date
      }
      user{
        firstName
        lastName
        email
      }
    }
  }
`;

const GET_USER_BOOKING = gql`
  query userBookings {
    userBookings {  
        event {
          _id 
        }
      
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

export default function Event(props) {
  const classes = useStyles();

  const [bookEvent] = useMutation(CREATE_BOOKING, {
    onCompleted: (data) => {
   //   console.log("data", data);
      refetch()
    },
    onError: (error) => {
     console.log(error)
    },
  });

  const {data,refetch} = useQuery(GET_USER_BOOKING, {
    onCompleted: (data) => {
   //   console.log("data", data);
      
    },
    onError: (error) => {
     console.log(error)
    },
  });
  //console.log('data',data)
  const bookedEvent  = data ? data.userBookings.map(x=> x.event._id) : []
//console.log('bookedEvent',bookedEvent) 
  const createBooking = (id) =>{
      bookEvent({
        variables:{
          id: id
        }
      })
  }

  return (
    <Grid container spacing={2}>
      {props.events &&
        props.events.map((event, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} >
              <Card key={index} >
              <CardMedia
          className={classes.media}
          image={eventImg}
          title={event.title}
        />
                <CardContent >
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
                    {`Date: ${new Date(Number(event.date)).toDateString()} ${new Date(Number(event.date)).toLocaleTimeString()} `}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                   disabled={bookedEvent.indexOf(event._id) !== -1}
                  variant="outlined" color="primary" 
                  size="small" 
                  onClick={() => createBooking(event._id)}>
                    Book
                  </Button>
                  {
                    bookedEvent.indexOf(event._id) !== -1 ?
                    <CheckCircleIcon fontSize="small" color="primary"  />
                    : null
                  }
                  
                 
                </CardActions>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
}
