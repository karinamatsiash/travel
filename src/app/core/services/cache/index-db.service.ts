import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDBService {
	private static readonly appId = 'TRAVEL';
	private static readonly indexDBVersion = 1;

	public static execute(
		storeName: string,
		requestor: (store: IDBObjectStore) => any,
		mode: IDBTransactionMode = 'readonly',
	): Observable<any> {
		return new Observable((observer: Observer<any>) => {
			this.openStore(storeName, mode).subscribe(
				(store: IDBObjectStore) => {
					const request = requestor(store);

					request.addEventListener('success', () => {
						observer.next(request.result);
						observer.complete();
					});
					request.addEventListener('error', () => {
						observer.error(request.error);
						observer.complete();
					});
				},
				(error) => {
					observer.error(error);
					observer.complete();
				},
			);
		});
	}

	private static openStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Observable<IDBObjectStore> {
		return new Observable((observer: Observer<IDBObjectStore>) => {
			if (indexedDB) {
				const request = indexedDB.open(this.appId, this.indexDBVersion);

				request.addEventListener('upgradeneeded', (event: IDBVersionChangeEvent) => {
					this.initDatabase(storeName, event);
				});
				request.addEventListener('success', () => {
					observer.next(request.result.transaction(storeName, mode).objectStore(storeName));
					observer.complete();
				});
				request.addEventListener('error', () => {
					observer.error(request.error);
					observer.complete();
				});
			} else {
				observer.error('IndexedDB is not supported');
				observer.complete();
			}
		});
	}

	private static initDatabase(storeName: string, event: IDBVersionChangeEvent): void {
		const database = (event.target as IDBOpenDBRequest).result;

		if (database.objectStoreNames.contains(storeName)) {
			database.deleteObjectStore(storeName);
		}

		database.createObjectStore(storeName);
	}
}
