import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { TitleState } from '@core/store/title';
import { of } from 'rxjs';

describe('AppComponent', () => {
	let fixture: ComponentFixture<AppComponent>;
	let component: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [TranslateModule.forRoot(), NgxsModule.forRoot([TitleState])],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it(`should have as title 'travel'`, () => {
		spyOnProperty(component, 'titleName$').and.returnValue(of('TRAVEL'));
		fixture.detectChanges();
		expect(component.titleName).toEqual('TRAVEL');
	});
});
