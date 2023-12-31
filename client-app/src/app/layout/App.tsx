import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../Features/activities/dashboards/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  const [activities, setActivities] = useState<Activity []>([]);
  const [selectedActivity, setSelectedActivities] = useState<Activity |undefined>(undefined);
  const [editMode, setEditMode] =  useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setSelectedActivities(activities.find( x => x.id === id))
  }

  function handleCancelSelectActivities(){
    setSelectedActivities(undefined);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then (() => {
        setActivities([...activities.filter(x => x.id !== activity.id),activity])
        setEditMode(false);
        setSubmitting(false);

      })
    }else{
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setEditMode(false);
        setSubmitting(false);        
      })
    }

    // activity.id
    // ? setActivities([...activities.filter(x => x.id !== activity.id),activity] )
    // : setActivities([...activities,{...activity, id: uuid()}]);
    // setEditMode(false);
    // setSelectedActivities(activity);

  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.del(id).then( () => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);
    })

  }

  if (loading) return <LoadingComponent content='Loading app'/>;

  return (
    <Fragment >
          <NavBar openForm={handleFormOpen} />
          <Container style={{marginTop: '7em'}}>
            <h2>{activityStore.title}</h2>
            <Button content='Add exclamation!' positive onClick={activityStore.setTitle} /> 
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
              submitting={submitting}
            />


          </Container>

    </Fragment>
  );
}

export default observer (App);
