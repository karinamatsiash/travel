import { ITitleState } from '@core/store/title/title.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetTitleName } from '@core/store/title/title.action';

@State<ITitleState>({
	name: 'title',
	defaults: {
		name: 'travel',
	},
})
@Injectable({
	providedIn: 'root',
})
export class TitleState {
	@Action(SetTitleName)
	public setTitleName(ctx: StateContext<ITitleState>, action: SetTitleName): void {
		ctx.patchState({
			name: action.name,
		});
	}

	@Selector()
	public static getTitleName(state: ITitleState): string {
		return state.name;
	}
}
