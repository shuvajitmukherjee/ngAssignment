import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { contentService } from '../services/content.services'

// interface ContentsType {
//   title: string,
//   sfxPool: {'@value':string}
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [contentService]
})

export class AppComponent implements OnInit {
  contents: any = {};
  constructor(private _contentService: contentService) { }
  ngOnInit() {
    this._contentService.getContent()
      .subscribe(resContent => {
        this.contents = resContent;
        console.log(this.contents);
      });

  }
}
