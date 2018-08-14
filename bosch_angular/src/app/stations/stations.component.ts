import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

  private station;
  private stations = {
    'ST10': 1,
    'ST20': 2,
    'ST30': 3,
    'ST40': 4,
    'ST50': 5,
    'ST60': 6,
    'ST70': 7,
  };  // 路由地址

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.get_station();
    this.router.events
    .filter( (event) => event instanceof NavigationEnd )
    .subscribe( (event: NavigationEnd) => {
      this.get_station();
    });  // 监听url变化
  }

  get_station(): void {
    this.station = this.route.snapshot.paramMap.get('station');
    if( ! (this.station in this.stations) ) {
      this.router.navigate(['/login/program']);  // 如果不在路由里，则跳转到404，后续添加
    }
    
  }

}
