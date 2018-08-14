import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { LOGIN_STATES } from '../login_states';

@Injectable()
export class StationRouteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if (LOGIN_STATES.station_user) {
      return true;
    }
    return false;

  }
}