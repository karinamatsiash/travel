import { Injectable } from '@angular/core';
import { combineLatest, from, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as QS from 'qs';
import { Languages, Themes } from '@core/models';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AppBootstrapService {
	constructor(private translate: TranslateService) {}

	public init(): Observable<any> {
		const params = QS.parse(window.location.search.slice(1));
		const appLocalization = this.translate.use((params['lang'] as Languages) || Languages.English);
		const themes = from(import(`../../../themes/${params['theme'] || Themes.Light}.less`));
		return combineLatest([themes, appLocalization]).pipe(first());
	}
}
