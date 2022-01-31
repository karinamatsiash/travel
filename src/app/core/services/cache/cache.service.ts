import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoggerType, Nullable } from '@core/models';
import { IndexedDBService, LoggerService } from '@core/services';

const storeName = 'TRAVEL_STORE';
const TIME_OF_KEEPING_IN_CACHE_MS = 8 * 60 * 60 * 1000; // 8 hours

export enum CacheCallbackCondition {
	OnValueChange = 'onValueChange',
	OnRequest = 'onRequest',
}

export interface IDBObject<T = any> {
	value: T;
	cachedAt: number;
	cachingTimeInMS: number;
}

export interface ICachingTime {
	weeks?: number;
	days?: number;
	hours?: number;
}

interface IActionCallbackConfig {
	callback: Function;
	condition: CacheCallbackCondition;
}

interface IRequestConfig<T = any> {
	key: string;
	request: Observable<T>;
	cachingTime?: ICachingTime;
	action?: IActionCallbackConfig;
	shouldSkipUpdatingData?: boolean;
	shouldIgnoreCachedData?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
	private static requests = new Map<string, Subscription>();

	public static requestData<T>(requestConfig: IRequestConfig<T>): Observable<T> {
		return this.getValueFromDB<T>(requestConfig.key).pipe(
			switchMap((cachedData: Nullable<IDBObject<T>>) => {
				if (!cachedData) {
					return requestConfig.request.pipe(tap((data: T) => this.updateValueInDB<T>(requestConfig, data)));
				}

				if (!requestConfig.shouldSkipUpdatingData) {
					const subscription = requestConfig.request
						.pipe(filter((updatedData: any) => updatedData.response !== null))
						.subscribe(
							(updatedData: T) => {
								this.updateValueInDB<T>(requestConfig, updatedData, cachedData);
							},
							(error) => LoggerService.send(error.message, LoggerType.Error),
						);

					if (this.requests.has(requestConfig.key)) {
						const currentSubscription = this.requests.get(requestConfig.key);
						currentSubscription?.unsubscribe();
					}

					this.requests.set(requestConfig.key, subscription);
				}

				return of(cachedData.value);
			}),
		);
	}

	public static getValueFromDB<T>(key: string): Observable<Nullable<IDBObject<T>>> {
		return IndexedDBService.execute(storeName, (store) => store.get(key), 'readonly').pipe(
			map((cacheItem: IDBObject<T>) => {
				return cacheItem && this.isValueInCacheValid(cacheItem) ? cacheItem : null;
			}),
			catchError((error) => {
				LoggerService.send(error.message, LoggerType.Error);
				return of(null);
			}),
		);
	}

	public static setValueToDB<T>(key: string, value: T, cachingTimeInMS: number): Observable<string | null> {
		const cachedAt = new Date().getTime();
		return IndexedDBService.execute(
			storeName,
			(store) => store.put({ value, cachedAt, cachingTimeInMS }, key),
			'readwrite',
		).pipe(
			catchError((error) => {
				LoggerService.send(error.message, LoggerType.Error);
				return of(null);
			}),
		);
	}

	public static getCachingTimeInMS({ weeks = 0, days = 0, hours = 0 }: ICachingTime): number {
		const weeksToDays = (w: number) => w * 7;
		const daysToHours = (d: number) => d * 24;
		const hoursToMS = (h: number) => h * 60 * 60 * 1000;

		return hoursToMS(daysToHours(weeksToDays(weeks) + days) + hours);
	}

	private static isValueInCacheValid(cacheValue: IDBObject): boolean {
		return !!cacheValue.value && !this.isTimeKeepInCacheExpire(cacheValue);
	}

	private static isTimeKeepInCacheExpire(cacheValue: IDBObject): boolean {
		return new Date().getTime() - cacheValue.cachedAt > (cacheValue.cachingTimeInMS || TIME_OF_KEEPING_IN_CACHE_MS);
	}

	private static updateValueInDB<T>(requestConfig: IRequestConfig<T>, data: T, oldData?: IDBObject<T>): void {
		this.setValueToDB<T>(
			requestConfig.key,
			data,
			this.getCachingTimeInMS(requestConfig.cachingTime || {}),
		).subscribe(() => {
			if (requestConfig.action && oldData) {
				this.executeAction(requestConfig.action, oldData, data);
			}
		});
	}

	private static executeAction<T = any>(
		actionConfig: IActionCallbackConfig,
		cachedData: IDBObject<T>,
		updatedData: T,
	): void {
		switch (actionConfig.condition) {
			case CacheCallbackCondition.OnValueChange:
				if (JSON.stringify(cachedData.value) !== JSON.stringify(updatedData)) {
					actionConfig.callback();
				}
				break;
			case CacheCallbackCondition.OnRequest:
				actionConfig.callback();
		}
	}
}
