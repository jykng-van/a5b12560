import {React, useState} from 'react';

import moment from 'moment';

const CallDetails = ({callId, currentCall, setCall, archiveCall})=>{

    return(
        <section id="call-details" className={callId != null ? 'current-mode':''}>
            <div className="details-header">
                <h2 className={currentCall.direction=='inbound' ? 'incoming':'outgoing'}>Call Details</h2>
                <a href="#" className="back-button" onClick={e=>{
                    e.preventDefault();
                    setCall(null)
                }}>&lt; Back</a>
                {currentCall.is_archived ? (<span className="archived">Archived</span>):''}
            </div>
            <div className="details-body">
                <div className="detail-row">
                    <strong>From:</strong> {currentCall.from}
                </div>
                <div className="detail-row">
                    <strong>To:</strong> {currentCall.to}
                </div>
                <div className="detail-row">
                    <strong>Via:</strong> {currentCall.via}
                </div>
                <div className="detail-row">
                    <strong>Duration:</strong> {(currentCall.duration < 60 ? `${currentCall.duration} seconds` : `${Math.floor(currentCall.duration/60)}:${currentCall.duration%60} minutes`)}
                </div>
                <div className="detail-row">
                    <strong>Called at:</strong> {moment(currentCall.created_at).format('MM/DD/YYYY')} {moment(currentCall.created_at).format('LT')}
                </div>
            </div>
            {!currentCall.is_archived ?
            (<div className="call-actions">
                <button className="archive-button" type="button" onClick={()=>{
                    archiveCall(currentCall.id).then(()=>setCall(currentCall.id))
                }}>Archive Call</button>
            </div>):
            ''
            }
        </section>
    );
}
export default CallDetails;