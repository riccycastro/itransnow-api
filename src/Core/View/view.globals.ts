import edge from 'edge.js';
import BooleanProvider from '../Providers/boolean.provider';
import { RoutesDefinition } from './routes-definition';

export const initGlobals = function () {
  edge.global('stringToBoolean', BooleanProvider.toBoolean);
  edge.global('resolveUrl', RoutesDefinition.url);
  edge.global('resolveRoute', RoutesDefinition.routeByName);
};
