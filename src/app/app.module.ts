import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from '@shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { TitleState } from '@core/store/title';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		SharedModule,
		RouterModule.forRoot([]),
		NgxsModule.forRoot([TitleState], {
			developmentMode: !environment.production,
		}),
		NgxsReduxDevtoolsPluginModule.forRoot({
			disabled: environment.production,
		}),
		NgxsRouterPluginModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
			useDefaultLang: false,
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
