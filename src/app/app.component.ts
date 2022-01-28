import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { TitleState } from '@core/store/title';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	@Select(TitleState.getTitleName) public titleName$: Observable<string>;
}
