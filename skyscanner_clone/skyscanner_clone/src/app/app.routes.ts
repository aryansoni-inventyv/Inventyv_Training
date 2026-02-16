import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { HotelComponent } from './component/hotel/hotel-component/hotel-component';
import { CarComponent } from './component/car/car-component/car-component';
import { FlightComponent } from './component/flight/flight-component/flight-component';
import { FlightList } from './component/flight/flight-list/flight-list';
import { HotelList } from './component/hotel/hotel-list/hotel-list';
import { CarList } from './component/car/car-list/car-list';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: 'home', component: Home },
    {
        path: 'flights',
        children: [
            { path: '', component: FlightComponent },
            { path: 'results', component: FlightList }
        ]
    },
    { path: 'hotels' , 
        children : [
            {path : '' , component :  HotelComponent},
            {path :  'results' , component: HotelList} 
        ]
     },
     {
        path :  'cars' , 
        children : [
            {path : '' , component : CarComponent},
            {path : 'results' , component: CarList}
        ]
     },
     {
        path : '**' , 
        redirectTo:'/home'
     }
];
