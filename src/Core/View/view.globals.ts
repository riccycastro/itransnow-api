import edge from 'edge.js';
import BooleanProvider from '../Providers/boolean.provider';

export const initGlobals = function () {
  edge.global('stringToBoolean', BooleanProvider.toBoolean);
};
