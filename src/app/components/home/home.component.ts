import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonItem } from 'src/app/models/person-item';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['#', 'firstName', 'lastName', 'email','settings'];
  Persons !:PersonItem[];
  dataSource = new MatTableDataSource<PersonItem>(this.Persons);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private route: ActivatedRoute,private router: Router,private personService:PersonService,public dialog: MatDialog) { }

  ngOnInit(): void {
    // setInterval(()=>{
    //   this.dataSource.paginator = this.paginator;
    // },0.000001)
    this.getAllPersons();
  }
  addPerson(){
    this.router.navigate(['/managePerson'])
  }
  editPerson(id:number){
    this.router.navigate(['/managePerson',id])
  }
  getAllPersons(){
    this.personService.getAllPersons().subscribe(res=>{
      if(res.status){
        this.Persons = res.response;
        this.dataSource = new MatTableDataSource<PersonItem>(this.Persons);
        this.dataSource.paginator = this.paginator;
        console.log(this.Persons);
      }
    })
  }
  openDeleteDialog(id:number,name:string){
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id:id,name: name},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPersons();
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService:PersonService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletConfiremd(): void {
    this.personService.deletePerson(this.data.id).subscribe(res=>{
      if(res.status)
        this.dialogRef.close();
    });
  }
}