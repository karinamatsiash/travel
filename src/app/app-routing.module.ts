import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
	{ path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) },
	{ path: 'country', loadChildren: () => import('./country/country.module').then((m) => m.CountryModule) },
	{ path: 'wishList', loadChildren: () => import('./wish-list/wish-list.module').then((m) => m.WishListModule) },
	{ path: '', component: AppComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [],
})
export class AppRoutingModule {}
