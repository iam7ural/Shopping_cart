import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription,Observable, of, } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SubheaderService } from 'src/app/services/subheader.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/utils/date-picker.utils';
import Swal from "sweetalert2";
import { map, tap } from 'rxjs/operators';
import { SpeCodeList } from 'src/app/models/specodelist.model';
import { SpeCodeListsService } from 'src/app/services/specodelist.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
})
export class DashboardComponent implements OnInit,OnDestroy,AfterViewInit {
  per_Btn_Add:number;
  per_Btn_Edit:number;
  per_Btn_View:number;
  per_Btn_Delete:number;

  @Input() data: any;


  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private subheaderService: SubheaderService,
    private modalService: NgbModal,
    private specodelistsService: SpeCodeListsService,
    public router: Router,
    private auth: AuthenticationService,
  ) {
    this.subscriptions.push(
      this.subheaderService.getModalEvent().subscribe(() => {
        // this.create();
      })
    );
   }

  ngOnInit(): void {
  }



  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  get f() {
		return this.formGroup.controls;
	}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }


  ngAfterViewInit() {
    this.subheaderService.setTitle('DASHBOARD');
    this.subheaderService.setAddButton({ Show: false, Title: 'Add' });
    this.subheaderService.setExportButton({ Show: false, Title: 'Download' });
    this.subheaderService.setToggleFilterButton({Show: false, Title: 'Filter'});
    this.subheaderService.setExportButton({ Show: false, Title: 'Download' });
    this.subheaderService.setSearchInput({ Show: false });
    this.subheaderService.setCheckButton({ Show: false, Title: 'Check' });
  }
}
