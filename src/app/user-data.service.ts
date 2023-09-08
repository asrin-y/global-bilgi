import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from './userData.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private apiUrl = 'http://localhost:5000/getAllRecordsofUser/glb901'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getRecordsByAgent(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUrl);
  }
}
