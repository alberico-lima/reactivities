import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../Features/activities/dashboards/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<Activity []>([]);
  const [selectedActivity, setSelectActivities] = useState<Activity |undefined>(undefined);
  const [editMode, setEditMode] =  useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response => {
      console.log(response);
      setActivities(response.data);
    })
  },[])

  function handleselectActivity(id : string){
    setSelectActivities(activities.find( x => x.id === id))
  }

  function handleCancelSelectActivities(){
    setSelectActivities(undefined);
  }

  function handleFormOpen(id? : string)
  {
    id ? handleselectActivity(id): handleCancelSelectActivities();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  return (
    <Fragment >
          <NavBar openForm={handleFormOpen} />
          <Container style={{marginTop: '7em'}}>
            <ActivityDashBoard 
              activities={activities} 
              selectedActivity={selectedActivity}
              selectActivity={handleselectActivity}
              cancelSelectActivity={handleCancelSelectActivities}
              editMode={editMode}
              openForm={handleFormOpen}
              closeForm={handleFormClose}
            />


          </Container>

    </Fragment>
  );
}

export default App;
