import { head } from 'ramda';
import uuid from 'uuid/v4';
import {
  deleteByID,
  loadByID,
  notify,
  now,
  paginate,
  qk
} from '../database/grakn';
import { BUS_TOPICS } from '../config/conf';

export const findAll = args => paginate('match $m isa City', args);

export const findById = cityId => loadByID(cityId);

export const markingDefinitions = (cityId, args) =>
  paginate(
    `match $marking isa Marking-Definition; 
    $rel(marking:$marking, so:$city) isa object_marking_refs; 
    $city id ${cityId}`,
    args
  );

export const addCity = async (user, city) => {
  const createCity = qk(`insert $city isa City 
    has type "city";
    $city has stix_id "city--${uuid()}";
    $city has stix_label "";
    $city has stix_label_lowercase "";
    $city has name "${city.name}";
    $city has description "${city.description}";
    $city has name_lowercase "${city.name.toLowerCase()}";
    $city has description_lowercase "${
      city.description ? city.description.toLowerCase() : ''
    }";
    $city has created ${now()};
    $city has modified ${now()};
    $city has revoked false;
    $city has created_at ${now()};
    $city has updated_at ${now()};
  `);
  return createCity.then(result => {
    const { data } = result;
    return loadByID(head(data).city.id).then(created =>
      notify(BUS_TOPICS.StixDomainEntity.ADDED_TOPIC, created, user)
    );
  });
};

export const cityDelete = cityId => deleteByID(cityId);