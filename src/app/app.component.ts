import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { TitleState } from '@core/store/title';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	@Select(TitleState.getTitleName) public titleName$: Observable<string>;

	public titleName: string;

	public ngOnInit(): void {
		this.titleName$.subscribe((titleName) => {
			this.titleName = titleName;
		});
	}
}
