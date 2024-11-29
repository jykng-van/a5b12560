import {React, useState} from 'react';

import moment from 'moment';

const ActivityList = ({activities, callId, setCall, viewArchive, archiveCalls, resetCalls})=>{
    //const [showList, setShowList] = useState(true);

    let filtered_activities = activities
        .filter(activity => activity.is_archived == viewArchive)
        .sort((a,b)=>b.created_at > a.created_at);
    let date_groups = Object.groupBy(filtered_activities, ({created_at}) => moment(created_at).format('YYYY-MM-DD'));
    console.log(filtered_activities);
    console.log(date_groups);
    return (
        <section id="activity-list" className={callId == null ? 'current-mode':''}>

            {
            filtered_activities.length==0 ?
            (
                <div className="empty-list">No Activity Found</div>
            )
            :
            (<div className="list">
            {Object.entries(date_groups).map((entry) => {
                let date = entry[0];
                let calls = entry[1];
                return (
                <div className="date-group" key={date}>
                    <div className="date"><span>{moment(date).format('MMMM DD, YYYY')}</span></div>
                    <div className="date-calls">
                        {calls.map((activity) =>{
                            return (
                                <a className="card" href="#" key={activity.id} onClick={e=>{
                                    e.preventDefault();
                                    setCall(activity.id);
                                }}>
                                    <div className="card-header">
                                        {activity.via}
                                    </div>
                                    <div className="card-body">
                                    <div>
                                        <div className={(activity.direction=='inbound' ? 'incoming':'outgoing')+(` ${activity.call_type}`)}>
                                        {
                                        activity.call_type=='answered' ?
                                            (activity.duration < 60 ? `${activity.duration} seconds` : `${Math.floor(activity.duration/60)}:${activity.duration%60} minutes`)
                                            :
                                            (activity.call_type=='missed' ? 'Missed Call':'Voicemail')
                                        }
                                        </div>
                                    </div>
                                    <div className="call-date">
                                        <div className="time">{moment(activity.created_at).format('LT')}</div>
                                    </div>
                                    </div>
                                </a>
                                );
                            })
                        }
                    </div>
                </div>)})
            }</div>)}
            {filtered_activities.length>0 ?
            (
            <div className="list-actions">
                {
                    viewArchive===true ?
                    (<button className="archive-button" onClick={resetCalls}>Unarchive Calls</button>)
                    :
                    (<button className="archive-button" onClick={archiveCalls}>Archive Calls</button>)
                }

            </div>
            ):''
            }


        </section>
    )
}
export default ActivityList;