import { Component } from '@angular/core';
import { UserData } from '../userData.model';
import { UserDataService } from '../user-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent {
  additionalUserDataList: UserData[] = [];
  private apiBaseUrl = 'http://localhost:5000';

  startDate: string;
  endDate: string;

  constructor(private userDataService: UserDataService, private http: HttpClient) {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());

    this.startDate = this.formatDate(lastMonthDate);
    this.endDate = this.formatDate(currentDate);
    
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.fetchAdditionalUserData();
  }

  fetchAdditionalUserData() {
    this.http.get(`${this.apiBaseUrl}/getAllRecords`).subscribe(
      (data: any[]) => {
        this.additionalUserDataList = data;
        this.sortListByDateInfo();
      },
      (error) => {
        console.error('Failed to fetch additional user data:', error);
      }
    );
  }

  applyDateRangeFilter() {
    if (!this.startDate || !this.endDate) {
      console.log('Please select both start and end dates.');
      return;
    }

    this.additionalUserDataList = this.additionalUserDataList.filter((record) => {
      const recordDate = new Date(record.dateInfo);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      return recordDate >= startDate && recordDate <= endDate;
    });

    this.sortListByDateInfo();
  }

  sortListByDateInfo() {
    this.additionalUserDataList.sort((a, b) => {
      const dateA = new Date(a.dateInfo).getTime();
      const dateB = new Date(b.dateInfo).getTime();
      return dateB - dateA;
    });
  }
  
}
