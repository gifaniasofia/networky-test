import React from 'react';

import type { Api } from '../configs/api';

export const ApiContext = React.createContext<Api | undefined>(undefined);