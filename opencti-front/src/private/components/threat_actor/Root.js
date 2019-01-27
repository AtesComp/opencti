import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from '../../../relay/environment';
import TopBar from '../nav/TopBar';
import ThreatActor from './ThreatActor';
import ThreatActorReports from './ThreatActorReports';
import ThreatActorKnowledge from './ThreatActorKnowledge';

const threatActorQuery = graphql`
    query RootThreatActorQuery($id: String!) {
        threatActor(id: $id) {
            ...ThreatActor_threatActor
            ...ThreatActorHeader_threatActor
            ...ThreatActorOverview_threatActor
            ...ThreatActorReports_threatActor
            ...ThreatActorKnowledge_threatActor
        }
    }
`;

class RootThreatActor extends Component {
  render() {
    const { me, match: { params: { threatActorId } } } = this.props;
    return (
      <div>
        <TopBar me={me || null}/>
        <QueryRenderer
          query={threatActorQuery}
          variables={{ id: threatActorId }}
          render={({ props }) => {
            if (props && props.threatActor) {
              return (
                <div>
                  <Route exact path='/dashboard/knowledge/threat_actors/:threatActorId' render={
                    routeProps => <ThreatActor {...routeProps} threatActor={props.threatActor}/>
                  }/>
                  <Route exact path='/dashboard/knowledge/threat_actors/:threatActorId/reports' render={
                    routeProps => <ThreatActorReports {...routeProps} threatActor={props.threatActor}/>
                  }/>
                  <Route exact path='/dashboard/knowledge/threat_actors/:threatActorId/knowledge' render={
                    () => (<Redirect to={`/dashboard/knowledge/threat_actors/${threatActorId}/knowledge/overview`}/>)
                  }/>
                  <Route path='/dashboard/knowledge/threat_actors/:threatActorId/knowledge' render={
                    routeProps => <ThreatActorKnowledge {...routeProps} threatActor={props.threatActor}/>
                  }/>
                </div>
              );
            }
            return (
              <div> &nbsp; </div>
            );
          }}
        />
      </div>
    );
  }
}

RootThreatActor.propTypes = {
  children: PropTypes.node,
  match: PropTypes.object,
  me: PropTypes.object,
};

export default withRouter(RootThreatActor);
