import { Injectable } from '@angular/core';
import { LoggerType } from '@core/models';

@Injectable({
	providedIn: 'root',
})
export class LoggerService {
	public static send(message: string, type: LoggerType): void {
		console[type](message);
	}
}
