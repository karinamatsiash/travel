import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TitleState } from '@core/store/title/title.state';
import { SetTitleName } from '@core/store/title/title.action';

describe('TitleState', () => {
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([TitleState])],
		});

		store = TestBed.inject(Store);
	});

	it('should set title name', () => {
		store.dispatch(new SetTitleName('title name'));

		const name = store.selectSnapshot((state) => state.title.name);
		expect(name).toBe('title name');
	});
});
