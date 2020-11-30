import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useMutation, gql,useQuery } from "@apollo/client";
import Error from "../components/Error";
import Event from '../components/events'
const CREATE_EVENT = gql`
  mutation createEvent(
    $title: String!
    $description: String!
    $price: Float!
    $date: String!
  ) {
    createEvents(
      eventInput: {
        title: $title
        description: $description
        price: $price
        date: $date
      }
    ) {
      _id
      title
      description
      price
      date
      creator {
        firstName
        lastName
        email
      }
    }
  }
`;

const GET_EVENT = gql`
  query getEvents{
    events{
      _id
      title
      description
      price
      date
      creator {
        firstName
        lastName
        email
      }
    }
  }
`;


export default function EventsPage() {
  const [open, setOpen] = React.useState(false);

  const eventTitleRef = React.useRef(null);
  const eventDescRef = React.useRef(null);
  const eventPriceRef = React.useRef(null);
  const eventDateRef = React.useRef(null);
  const [isError, setIsError] = React.useState(false);
  const [message, setMessage] = React.useState("");


  const {data,refetch} = useQuery(GET_EVENT)
  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted: (data) => {
    //  console.log("data", data);
      eventTitleRef.current.value = "";

      eventDescRef.current.value = "";
      eventPriceRef.current.value = "";
      eventDateRef.current.value = "";
      setOpen(false);
      refetch()
    },
    onError: (error) => {
      setIsError(true);
      setMessage(error.message);
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
    setIsError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateEvents = () => {
    const title = eventTitleRef.current.value;
    const description = eventDescRef.current.value;
    const price = Number(eventPriceRef.current.value);
    const date = new Date(eventDateRef.current.value).toISOString();
  //  console.log("price", price);
    createEvent({
      variables: {
        title: title,
        description: description,
        price: price,
        date: date,
      },
    });
    //refetch()

  };

    

  return (
    <Container maxWidth="md" fixed style={{"padding":"20px"}}>
      <Button variant="outlined" style={{"marginBottom":"20px"}} color="primary" onClick={handleClickOpen}>
        Create
      </Button>
    <Grid container spacing={2} >

      <Grid item xs={12}>
        <Event events={data ? data.events : []}/>
      </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                autoFocus
                margin="dense"
                id="name"
                label="Event title"
                fullWidth
                type="text"
                inputRef={eventTitleRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                type="text"
                margin="dense"
                id="name"
                label="Event Description"
                fullWidth
                inputRef={eventDescRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                margin="dense"
                id="price"
                label="Price"
                fullWidth
                type="number"
                inputRef={eventPriceRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                margin="dense"
                id="date"
                type="datetime-local"
                label="Event Date"
                fullWidth
                defaultValue={
                  new Date().getFullYear() +
                  "-" +
                  new Date().getMonth() +
                  "-" +
                  new Date().getDate() + 'T' + "10:30"
                }
                inputRef={eventDateRef}
              />
            </Grid>
            <Grid item xs={12}>
              {isError ? (
                <Error
                  severity="error"
                  closeError={setIsError}
                  message={message}
                />
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleCreateEvents}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
  );
}
