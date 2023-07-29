import React, { Fragment, useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../Features/activities/dashboards/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity []>([]);
  const [selectedActivity, setSelectActivities] = useState<Activity |undefined>(undefined);
  const [editMode, setEditMode] =  useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Activities.list()
    .then( 
      response => {
        let activities: Activity[]  = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
          
        });
        setActivities(activities);
        setLoading(false);
      }
    )
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

  function handleCreateOrEditActivity (activity: Activity) {
    activity.id
    ? setActivities([...activities.filter(x => x.id !== activity.id),activity] )
    : setActivities([...activities,{...activity, id: uuid()}]);
    setEditMode(false);
    setSelectActivities(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)])

  }

  if (loading) return <LoadingComponent content='Loading app'/>;

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
              createOrEdit={handleCreateOrEditActivity}
              deleteActivity={handleDeleteActivity}
            />


          </Container>

    </Fragment>
  );
}

export default App;
