import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { TitleState } from '@core/store/title';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Languages } from '@core/models';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	@Select(TitleState.getTitleName) public titleName$: Observable<string>;

	public titleName: string;

	constructor(private translateService: TranslateService, private route: ActivatedRoute) {}

	public ngOnInit(): void {
		this.titleName$.subscribe((titleName) => {
			this.titleName = titleName;
		});

		this.route.queryParams.subscribe((params) => {
			this.translateService.use(params['lang'] || Languages.English);
		});
	}
}
