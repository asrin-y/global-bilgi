import { Component, OnInit } from '@angular/core';
import { UserData } from '../userData.model';
import { UserDataService } from '../user-data.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-data-list',
  templateUrl: './user-data-list.component.html',
  styleUrls: ['./user-data-list.component.css']
})
export class UserDataListComponent implements OnInit {
  userDataList: UserData[] = [];
  newRecordForm: FormGroup;
  private apiBaseUrl = 'http://localhost:5000';
  isEdit: boolean = false;
  editedRecordId: number;
  isAdmin: boolean = false;
  additionalUserDataList: UserData[] = [];

  constructor(private userDataService: UserDataService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.initializeForm();
  }

  initializeForm() {
    // Define a custom validator function for the first three fields
    const nonEmptyFieldsValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
      const begin = control.get('begin').value;
      const end = control.get('end').value;
      const dateInfo = control.get('dateInfo').value;

      if (!begin || !end || !dateInfo) {
        return { nonEmptyFields: true };
      }

      return null; // Validation passed
    };

    this.newRecordForm = this.formBuilder.group({
      begin: ['', Validators.required],
      end: ['', Validators.required],
      dateInfo: ['', Validators.required],
      excuse: [''],
      excuseHours: [null],
      timeout: [null]
    }, { validator: nonEmptyFieldsValidator }); // Attach the custom validator
  }

  ngOnInit(): void {
    this.fetchUserData(); // Fetch initial data when the component initializes
    // this.fetchAdditionalUserData();
  }

  // Fetch additional data from the new API endpoint
  fetchAdditionalUserData() {
    // this.http.get(`${this.apiBaseUrl}/getAllRecords`).subscribe(
    //   (data: any[]) => {
    //     this.additionalUserDataList = data;
    //   },
    //   (error) => {
    //     console.error('Failed to fetch additional user data:', error);
    //   }
    // );
  }

  editRecord(record: UserData) {
    this.isEdit = !this.isEdit
  }
  
  removeRecord(record: UserData) {
    const idToDelete = record.id;
    if (!idToDelete) {
      return;
    }

    // Make an HTTP DELETE request to delete the record
    this.http.delete(`${this.apiBaseUrl}/deleteUserData/${idToDelete}`).subscribe(
      () => {
        console.log('User data deleted successfully');
        this.fetchUserData(); // Fetch data after a successful deletion
      },
      (error) => {
        console.error('Failed to delete user data:', error);
      }
    );
  }

  logFormValues() {
    const formValues = this.newRecordForm.value;
    console.log('Form Values:', formValues);

    const userData = {
      agentId: "glb901",
      firstName: "Asrin",
      lastName: "Yilmaz",
      begin: formValues.begin,
      end: formValues.end,
      dateInfo: formValues.dateInfo,
      excuse: formValues.excuse,
      excuseHours: formValues.excuseHours,
      timeout: formValues.timeout,
    };

    console.log('UserData:', userData);

    this.http.post(`${this.apiBaseUrl}/addUserData`, userData).subscribe(
      (response) => {
        console.log('User data added successfully:', response);
        this.fetchUserData(); // Fetch data after a successful addition
      },
      (error) => {
        console.error('Failed to add user data:', error);
      }
    );
  }

  onSubmit() {
    if (!this.isEdit) {
      // Check if the form is valid, including the custom validator
      if (this.newRecordForm.valid) {
        this.logFormValues();
      } else {
        // Form is not valid
        // You can handle this case, e.g., display an error message to the user.
        window.alert('Form is not valid. Make sure all required fields are filled.');
        return;
      }
    } else {
      this.isEdit = !this.isEdit;
      this.update();
    }
    this.newRecordForm.reset();
  }

  update(){
    const formValues = this.newRecordForm.value;
    console.log('Form Values:', formValues);

    const userData = {
      begin: formValues.begin,
      end: formValues.end,
      dateInfo: formValues.dateInfo,
      excuse: formValues.excuse,
      excuseHours: formValues.excuseHours,
      timeout: formValues.timeout,
    };

    this.http.put(`${this.apiBaseUrl}/updateUserData/${this.editedRecordId}`, userData).subscribe(
      (response) => {
        console.log('User data updated successfully:', response);
        this.fetchUserData(); // Fetch data after a successful addition
      },
      (error) => {
        console.error('Failed to add user data:', error);
      }
    );
  }

  fetchUserData() {
    // Fetch the list of data from your service
    this.userDataService.getRecordsByAgent().subscribe((data) => {
      this.userDataList = data;
    });
  }

  loadFormValuesForEdit(record: UserData) {
    // Assuming you have a UserData model with properties matching the form fields
    this.newRecordForm.setValue({
      begin: record.begin,
      end: record.end,
      dateInfo: record.dateInfo,
      excuse: record.excuse,
      excuseHours: record.excuseHours,
      timeout: record.timeout
    });
  
    this.editedRecordId = record.id;
  
    // Set the isEdit flag to true to indicate that it's an edit operation
    this.isEdit = true;
  }

  cancelEdit(){
    this.isEdit = !this.isEdit;
    this.newRecordForm.reset();
  }
  
}
