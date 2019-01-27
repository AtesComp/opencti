import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import inject18n from '../../../components/i18n';
import EntityStixRelations from '../stix_relation/EntityStixRelations';
import StixDomainEntityKnowledge from '../stix_domain_entity/StixDomainEntityKnowledge';
import StixRelation from '../stix_relation/StixRelation';
import SectorHeader from './SectorHeader';
import SectorKnowledgeBar from './SectorKnowledgeBar';

const styles = () => ({
  container: {
    margin: 0,
  },
  content: {
    paddingRight: 260,
  },
});

const inversedRelations = ['campaign', 'incident', 'intrusion-set'];

class SectorKnowledgeComponent extends Component {
  render() {
    const { classes, sector, location } = this.props;
    const link = `/dashboard/knowledge/sectors/${sector.id}/knowledge`;
    return (
      <div className={classes.container}>
        <SectorHeader sector={sector} variant='noalias'/>
        <SectorKnowledgeBar sectorId={sector.id}/>
        <div className={classes.content}>
          <Route exact path='/dashboard/knowledge/sectors/:sectorId/knowledge/relations/:relationId' render={
            routeProps => <StixRelation entityId={sector.id} {...routeProps} inversedRelations={inversedRelations}/>
          }/>
          {location.pathname.includes('overview') ? <StixDomainEntityKnowledge stixDomainEntityId={sector.id}/> : ''}
          {location.pathname.includes('attribution') ? <EntityStixRelations entityId={sector.id} relationType='uses' targetEntityType='Intrusion-Set' entityLink={link}/> : ''}
          {location.pathname.includes('campaigns') ? <EntityStixRelations entityId={sector.id} relationType='uses' targetEntityType='Campaign' entityLink={link}/> : ''}
          {location.pathname.includes('incidents') ? <EntityStixRelations entityId={sector.id} relationType='uses' targetEntityType='Incident' entityLink={link}/> : ''}
          {location.pathname.includes('victimology') ? <EntityStixRelations entityId={sector.id} relationType='targets' targetEntityType='Identity' entityLink={link}/> : ''}
          {location.pathname.includes('ttp') ? <EntityStixRelations entityId={sector.id} relationType='uses' targetEntityType='Attack-Pattern' entityLink={link}/> : ''}
          {location.pathname.includes('tools') ? <EntityStixRelations entityId={sector.id} relationType='uses' targetEntityType='Tool' entityLink={link}/> : ''}
          {location.pathname.includes('vulnerabilities') ? <EntityStixRelations entityId={sector.id} relationType='targets' targetEntityType='Vulnerability' entityLink={link}/> : ''}
        </div>
      </div>
    );
  }
}

SectorKnowledgeComponent.propTypes = {
  sector: PropTypes.object,
  classes: PropTypes.object,
  location: PropTypes.object,
  t: PropTypes.func,
};

const SectorKnowledge = createFragmentContainer(SectorKnowledgeComponent, {
  sector: graphql`
      fragment SectorKnowledge_sector on Sector {
          id
          ...SectorHeader_sector
      }
  `,
});

export default compose(
  inject18n,
  withRouter,
  withStyles(styles),
)(SectorKnowledge);
