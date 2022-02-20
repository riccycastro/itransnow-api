import { UnresolvedRouteException } from './unresolved-route.exception';
import * as Route from 'route-parser';

export type RouteContract = {
  title: string;
  url: Route;
  path: string;
};

export class RoutesDefinition {
  static url(routeName: string, data?: object): string {
    if (!RoutesDefinition.routes[routeName]) {
      throw new UnresolvedRouteException(routeName);
    }

    return RoutesDefinition.routes[routeName].url.reverse(data);
  }

  static path(routeName: string): string {
    if (!RoutesDefinition.routes[routeName]) {
      throw new UnresolvedRouteException(routeName);
    }

    return RoutesDefinition.routes[routeName].path;
  }

  static routeByUrl(url: string): RouteContract {
    for (const routeName of Object.keys(RoutesDefinition.routes)) {
      if (RoutesDefinition.routes[routeName].url.match(url)) {
        return RoutesDefinition.routes[routeName];
      }
    }

    throw new UnresolvedRouteException(url);
  }

  static routeByName(routeName: string): RouteContract {
    if (!RoutesDefinition.routes[routeName]) {
      throw new UnresolvedRouteException(routeName);
    }

    return RoutesDefinition.routes[routeName];
  }

  private static routes = {
    application_list: {
      title: 'Applications',
      url: new Route('/applications(/)'),
      path: [],
    },
    application_create: {
      title: 'Create Application',
      url: new Route('/applications/create(/)'),
      path: ['application_list'],
    },
    auth_login: {
      title: 'Create Application',
      url: new Route('/auth/login(/)'),
    },
    user_list: {
      title: 'Users',
      url: new Route('/users(/)'),
      path: [],
    },
    user_create: {
      title: 'Create User',
      url: new Route('/users/create(/)'),
      path: ['user_list'],
    },
  };
}
