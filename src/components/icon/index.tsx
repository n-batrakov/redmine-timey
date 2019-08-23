import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faFilter, faSync } from '@fortawesome/free-solid-svg-icons';

export const IconAdd = () => (<FontAwesomeIcon icon={faPlus} />);
export const IconBack = () => (<FontAwesomeIcon icon={faArrowLeft} />);
export const IconFilter = () => (<FontAwesomeIcon icon={faFilter} />);
export const IconRefresh = () => (<FontAwesomeIcon icon={faSync} />);