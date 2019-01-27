/* eslint-disable no-nested-ternary */
// TODO Remove no-nested-ternary
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  ArrowDropDown, ArrowDropUp, ArrowUpward, ArrowDownward, Dashboard, TableChart,
} from '@material-ui/icons';
import { QueryRenderer } from '../../relay/environment';
import inject18n from '../../components/i18n';
import ThreatActorsLines, { threatActorsLinesQuery } from './threat_actor/ThreatActorsLines';
import ThreatActorsCards, { threatActorsCardsQuery, nbCardsToLoad } from './threat_actor/ThreatActorsCards';
import ThreatActorCreation from './threat_actor/ThreatActorCreation';

const styles = () => ({
  linesContainer: {
    marginTop: 0,
    paddingTop: 0,
  },
  item: {
    paddingLeft: 10,
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  parameters: {
    float: 'left',
    marginTop: -10,
  },
  views: {
    float: 'right',
    marginTop: -10,
  },
  inputLabel: {
    float: 'left',
  },
  sortField: {
    float: 'left',
  },
  sortFieldLabel: {
    margin: '12px 15px 0 0',
    fontSize: 14,
    float: 'left',
  },
  sortIcon: {
    float: 'left',
    margin: '-5px 0 0 15px',
  },
});

const inlineStyles = {
  iconSort: {
    position: 'absolute',
    margin: '-3px 0 0 5px',
    padding: 0,
    top: '0px',
  },
  name: {
    float: 'left',
    width: '70%',
    fontSize: 12,
    fontWeight: '700',
  },
  created: {
    float: 'left',
    width: '15%',
    fontSize: 12,
    fontWeight: '700',
  },
  modified: {
    float: 'left',
    fontSize: 12,
    fontWeight: '700',
  },
};

class ThreatActors extends Component {
  constructor(props) {
    super(props);
    this.state = { view: 'cards', sortBy: 'name', orderAsc: true };
  }

  handleChangeView(mode) {
    this.setState({ view: mode });
  }

  handleChangeSortBy(event) {
    this.setState({ sortBy: event.target.value });
  }

  reverse() {
    this.setState({ orderAsc: !this.state.orderAsc });
  }

  reverseBy(field) {
    this.setState({ sortBy: field, orderAsc: !this.state.orderAsc });
  }

  SortHeader(field, label) {
    const { t } = this.props;
    return (
      <div style={inlineStyles[field]} onClick={this.reverseBy.bind(this, field)}>
        <span>{t(label)}</span>
        {this.state.sortBy === field ? this.state.orderAsc ? <ArrowDropDown style={inlineStyles.iconSort}/> : <ArrowDropUp style={inlineStyles.iconSort}/> : ''}
      </div>
    );
  }

  renderCardParameters() {
    const { t, classes } = this.props;
    return (
      <div>
        <InputLabel classes={{ root: classes.sortFieldLabel }}>{t('Sort by')}</InputLabel>
        <FormControl classes={{ root: classes.sortField }}>
          <Select
            name='sort-by'
            value={this.state.sortBy}
            onChange={this.handleChangeSortBy.bind(this)}
            inputProps={{
              name: 'sort-by',
              id: 'sort-by',
            }}
          >
            <MenuItem value='name'>{t('Name')}</MenuItem>
            <MenuItem value='created'>{t('Creation date')}</MenuItem>
            <MenuItem value='modified'>{t('Modification date')}</MenuItem>
          </Select>
        </FormControl>
        <IconButton aria-label='Sort by' onClick={this.reverse.bind(this)} classes={{ root: classes.sortIcon }}>
          {this.state.orderAsc ? <ArrowDownward /> : <ArrowUpward />}
        </IconButton>
      </div>
    );
  }

  renderCards() {
    return (
      <QueryRenderer
        query={threatActorsCardsQuery}
        variables={{
          count: nbCardsToLoad,
          orderBy: this.state.sortBy,
          orderMode: this.state.orderAsc ? 'asc' : 'desc',
        }}
        render={({ props }) => {
          if (props) {
            return <ThreatActorsCards data={props} dummy={false}/>;
          }
          return <ThreatActorsCards data={null} dummy={true}/>;
        }}
      />
    );
  }

  renderLinesParameters() {
    return (
      <div>
        &nbsp;
      </div>
    );
  }

  renderLines() {
    const { classes } = this.props;
    return (
      <List classes={{ root: classes.linesContainer }}>
        <ListItem classes={{ default: classes.item }} divider={false} style={{ paddingTop: 0 }}>
          <ListItemIcon>
            <span style={{ padding: '0 8px 0 8px', fontWeight: 700, fontSize: 12 }}>#</span>
          </ListItemIcon>
          <ListItemText primary={
            <div>
              {this.SortHeader('name', 'Name')}
              {this.SortHeader('created', 'Creation date')}
              {this.SortHeader('modified', 'Modification date')}
            </div>
          }/>
        </ListItem>
        <QueryRenderer
          query={threatActorsLinesQuery}
          variables={{ count: 25, orderBy: this.state.sortBy, orderMode: this.state.orderAsc ? 'asc' : 'desc' }}
          render={({ error, props }) => {
            if (error) { // Errors
              return <ThreatActorsLines data={null} dummy={true}/>;
            }
            if (props) { // Done
              return <ThreatActorsLines data={props}/>;
            }
            // Loading
            return <ThreatActorsLines data={null} dummy={true}/>;
          }}
        />
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.parameters}>
          {this.state.view === 'cards' ? this.renderCardParameters() : ''}
          {this.state.view === 'lines' ? this.renderLinesParameters() : ''}
        </div>
        <div className={classes.views}>
          <IconButton color={this.state.view === 'cards' ? 'secondary' : 'primary'}
                      classes={{ root: classes.button }}
                      onClick={this.handleChangeView.bind(this, 'cards')}>
            <Dashboard/>
          </IconButton>
          <IconButton color={this.state.view === 'lines' ? 'secondary' : 'primary'}
                      classes={{ root: classes.button }}
                      onClick={this.handleChangeView.bind(this, 'lines')}>
            <TableChart/>
          </IconButton>
        </div>
        <div className='clearfix'/>
        {this.state.view === 'cards' ? this.renderCards() : ''}
        {this.state.view === 'lines' ? this.renderLines() : ''}
        <ThreatActorCreation
            paginationOptions={{
              orderBy: this.state.sortBy,
              orderMode: this.state.orderAsc ? 'asc' : 'desc',
            }}/>
      </div>
    );
  }
}

ThreatActors.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  history: PropTypes.object,
};

export default compose(
  inject18n,
  withStyles(styles),
)(ThreatActors);
