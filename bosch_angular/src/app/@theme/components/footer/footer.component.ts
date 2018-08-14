import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="#" target="_blank">MaboTech</a></b> 2018</span>
    <div class="socials">
    </div>
  `,
})
export class FooterComponent {
}
