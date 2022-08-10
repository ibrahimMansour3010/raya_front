import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address';
import { Country } from 'src/app/models/Country/country';
import { Person } from 'src/app/models/person';
import { CountriesService } from 'src/app/services/countries.service';
import { PersonService } from 'src/app/services/person.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.css']
})

export class ManagePersonComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  countries: Country[] = [];
  status: Country[] = [];
  Cities: Country[] = [];

  selectedCountry !: Country;
  selectedState !: Country;
  selectedCity !: Country;

  address: Address[] = [];
  streetName: string = '';
  zipCode: Number = 0;
  editIndex: number = -1;
  isEditAddress: boolean = false;
  Person: Person = {
    id: 0,
    firstname: '',
    lastName: '',
    email: '',
    birthday: null,
    phone: '',
    gender: 0,
    address: []
  };

  matcher = new MyErrorStateMatcher();
  displayedColumns: string[] = ['No', 'countryName', 'stateName', 'cityName', 'streetName', 'zipCode', 'settings'];
  dataSource = new MatTableDataSource<Address>(this.address);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private countryService: CountriesService, private router: Router,
    private personService: PersonService, private activatedRoute: ActivatedRoute) {
    // this.countries.push({id:'1',name:'Egypt'});
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.personService.getPersonDetails(Number(this.activatedRoute.snapshot.paramMap.get('id')))
        .subscribe(res => {
          console.log(res.response);
          this.Person = res.response;
          this.address = this.Person.address;
          this.dataSource = new MatTableDataSource<Address>(this.address)
          this.dataSource.paginator = this.paginator;
        })
    }

    this.countryService.getAllCountries().subscribe(res => {
      this.countries = res;
      console.log(res);
    })
  }
  changeCountry() {
    this.countryService.getState(this.selectedCountry.iso2).subscribe(res => {
      this.status = res;
    })
  }
  changeStatus() {
    this.countryService.getCity(this.selectedCountry.iso2, this.selectedState.iso2).subscribe(res => {
      this.Cities = res;
    })
  }
  addAddress(isEdit: boolean) {
    let address: Address = {
      countryName: this.selectedCountry.name,
      countryId: this.selectedCountry.id,
      stateName: this.selectedState.name,
      stateId: this.selectedState.id,
      cityName: this.selectedCity.name,
      cityId: this.selectedCity.id,
      streetName: this.streetName,
      zipCode: this.zipCode,
    };
    if (isEdit) {
      this.address[this.editIndex] = address;
      this.isEditAddress = false;
    } else {
      this.address.push(address);
    }
    setInterval(() => {
      this.dataSource.paginator = this.paginator;
    }, 0.000001);
    console.log(this.address);
    this.selectedCountry = { id: 0, name: '', iso2: '' };
    this.selectedState = { id: 0, name: '', iso2: '' };
    this.selectedCity = { id: 0, name: '', iso2: '' };
    this.streetName = '';
    this.zipCode = 0;
  }

  deleteAddress(index: number) {
    this.address.splice(index, 1);
    this.dataSource = new MatTableDataSource<Address>(this.address)
    this.dataSource.paginator = this.paginator;
  }
  editAddress(element: Address, index: number) {
    console.log(element);
    let c = this.countries.find(i => i.id == element.countryId);
    if (c != undefined) {
      this.selectedCountry = c;
      this.countryService.getState(this.selectedCountry.iso2).subscribe(resState => {
        this.status = resState;
        let s = this.status.find(i => i.id == element.stateId);
        if (s != undefined) {
          this.selectedState = s;
          this.countryService.getCity(this.selectedCountry.iso2, this.selectedState.iso2).subscribe(resCity => {
            this.Cities = resCity;
            let city = this.Cities.find(i => i.id == element.cityId);
            if (city != undefined)
              this.selectedCity = city;
          })
        }
      })
    }


    this.streetName = element.streetName;
    this.zipCode = element.zipCode;
    this.editIndex = index;
    this.isEditAddress = true;
  }
  addPerson() {
    this.Person.address = this.address;
    this.Person.gender = Number(this.Person.gender);
    this.personService.managePerson(this.Person).subscribe(res => {
      if (res.status) {
        this.router.navigate(['/home']);
      }
    })
    console.log(this.Person);
  }
  cancelPerson() {
    this.router.navigate(['/home']);
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}