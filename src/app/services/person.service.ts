import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';
import { APIResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http:HttpClient) { }

  getAllPersons():Observable<APIResponse>{
    return this.http.get<APIResponse>(environment.personAPI+'api/Person');
  }

  getPersonDetails(id:number):Observable<APIResponse>{
    return this.http.get<APIResponse>(environment.personAPI+'api/Person/Get/'+id);
  }

  managePerson(person:Person):Observable<APIResponse>{
    return this.http.post<APIResponse>(environment.personAPI+'api/Person/ManagePerson',person);
  }

  deletePerson(id:number):Observable<APIResponse>{
    return this.http.delete<APIResponse>(environment.personAPI+'api/Person/Delete/'+id);
  }
}
