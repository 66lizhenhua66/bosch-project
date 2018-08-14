import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


import { Program } from '../../pages/program';
@Component({
  selector: 'hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {
  private id: number;
  private id_2_station = {
    0: 'ST10',
    1: 'ST20',
    2: 'ST30',
    3: 'ST40',
    4: 'ST50',
    5: 'ST60',
    6: 'ST70',
  };  // 定义返回键的路由

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.get_id();

    this.router.events
    .filter( (event) => event instanceof NavigationEnd )
    .subscribe( (event: NavigationEnd) => {
      this.get_id();
    });  // 监听url变化


    
  }

  get_id(): void {
    try {
      this.id =  parseInt(this.route.snapshot.paramMap.get('id')) - 1;
      if( ! (this.id in this.id_2_station) ) {
        this.id = 0
      }
    } catch(e) {
      console.log(e);
      this.id = 0
    }
    // this.selected_program = this.prescr_service.get_program(this.id);
    
  }
}
