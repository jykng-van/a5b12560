import {React, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import Header from './Header.jsx';
import ActivityList from './ActivityList.jsx';
import CallDetails from './CallDetails.jsx';

import axios from 'axios';

const App = () => {
  const baseurl = 'https://aircall-api.onrender.com';
  const [activities, setActivities] = useState([]);
  const [callId, setCallId] = useState(null);
  const [viewArchive, setViewArchive] = useState(false);
  const [currentCall, setCurrentCall] = useState({});

  //sets the current call
  function setCall(id){
    if (id!=null){
      axios.get(`${baseurl}/activities/${id}`).then((res) => {
        console.log(res.data);
        setCallId(id);
        setCurrentCall(res.data);
      });
    }else{
      setCurrentCall({});
      setCallId(null);
    }
  }
  //set viewArchive mode
  function viewArchiveMode(status){
    setViewArchive(status);
    setCallId(null);
  }
  function archiveCalls(){
    let to_archive = [];
    activities.forEach((activity)=>{
      if(!activity.is_archived){
        to_archive.push(archiveCall(activity.id));
      }
    });
    Promise.all(to_archive).then(()=>{
      getActivities();
    });
  }
  //archive call
  function archiveCall(id){
    console.log(id);
    return axios.patch(`${baseurl}/activities/${id}`,{
      is_archived: true
    }).then(()=>{
      let index = activities.findIndex((activity)=>activity.id==id);
      activities[index].is_archived = true;
    });
  }
  //unarchive call
  function resetCalls(){
    axios.patch(`${baseurl}/reset`).then((res)=>{
      getActivities();
    });
  }
  async function getActivities(){
    axios.get(`${baseurl}/activities`)
      .then((res) => {
        console.log(res.data);
        setActivities(res.data);
      }).catch(ex=>{
        console.error(ex);
        setTimeout(getActivities, 5000);
    });
  }

  //initialize activity list for the app
  (useEffect(() =>{
    if (activities.length==0){
      getActivities();
    }
  }), [activities]);


  return (
    <div className='container'>
      <Header setCall={setCall} viewArchive={viewArchive} viewArchiveMode={viewArchiveMode} />
      <div className="container-view">
        <ActivityList activities={activities} setCall={setCall} callId={callId} viewArchive={viewArchive} archiveCalls={archiveCalls} resetCalls={resetCalls} />
        <CallDetails callId={callId} setCall={setCall} currentCall={currentCall} archiveCall={archiveCall} />
      </div>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
