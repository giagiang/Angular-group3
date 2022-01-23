import { AfterViewInit, ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { LoadingService } from './Services/Spin/Loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'app';
  constructor(public loaderService: LoadingService, private renderer: Renderer2) { }

 
}
