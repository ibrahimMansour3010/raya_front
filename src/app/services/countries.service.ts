import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Country } from '../models/Country/country';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

  getAllCountries():Observable<Country[]|any>{
    return this.http.get(environment.countryAPI+'countries',{
      headers:{
        'X-CSCAPI-KEY':environment.countryAPIKey
      }
    });
  }

  getState(iso2:string):Observable<Country[]|any>{
    return this.http.get(environment.countryAPI+'countries/'+iso2+'/states',{
      headers:{
        'X-CSCAPI-KEY':environment.countryAPIKey
      }
    });
  }

  getCity(iso2Country:string,iso2State:string):Observable<Country[]|any>{
    return this.http.get(environment.countryAPI+'countries/'+iso2Country+'/states/'+iso2State+'/cities',{
      headers:{
        'X-CSCAPI-KEY':environment.countryAPIKey
      }
    });
  }
}
