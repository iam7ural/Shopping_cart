import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItemModel } from '../../models/breadcrumb.model';
import { LayoutService } from '../../services/layout.service';
import { SubheaderService } from '../../services/subheader.service';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
})
export class SubheaderComponent implements OnInit {
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';
  subheaderMobileToggle = false;
  subheaderDisplayDesc = false;
  subheaderDisplayDaterangepicker = false;
  title$: Observable<string>;
  breadcrumbs$: Observable<BreadcrumbItemModel[]>;
  description$: Observable<string>;
  search: string = '';

  addButton: any = { Show: false, Title: 'Əlavə et' };
  toggleFilterButton: any = { Show: false, Title: 'Filter' };
  checkButton: any = { Show: true, Title: 'Yoxla' };
  exportButton: any = { Show: false, Title: 'Yüklə' };
  printButton: any = { Show: false, Title: 'Çap et' };
  searchInput: any = { Show: false };

  constructor(
    private layout: LayoutService,
    private subheader: SubheaderService
  ) {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.breadcrumbs$ = this.subheader.breadCrumbsSubject.asObservable();
    this.description$ = this.subheader.descriptionSubject.asObservable();

    this.subheader.subheaderAddButton.subscribe((res) => {
      this.addButton = res;
    });
    this.subheader.subheaderToggleFilterButton.subscribe((res) => {
      this.toggleFilterButton = res;
    });
    this.subheader.subheaderExportButton.subscribe((res) => {
      this.exportButton = res;
    });
    this.subheader.subheaderCheckButton.subscribe((res) => {
      this.checkButton = res;
    });
    this.subheader.subheaderPrintButton.subscribe((res) => {
      this.printButton = res;
    });

    this.subheader.subheaderSearchInput.subscribe((res) => {
      this.searchInput = res;
      this.search = '';
    });
  }

  ngOnInit() {
    this.subheaderCSSClasses = this.layout.getStringCSSClasses('subheader');
    this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
      'subheader_container'
    );
    this.subheaderMobileToggle = this.layout.getProp('subheader.mobileToggle');
    this.subheaderDisplayDesc = this.layout.getProp('subheader.displayDesc');
    this.subheaderDisplayDaterangepicker = this.layout.getProp(
      'subheader.displayDaterangepicker'
    );
  }

  onAddClick() {
    this.subheader.sendModalEvent();
  }

  onToggleFilterClick() {
    this.subheader.sendToggleFilterEvent();
  }

  onExportClick() {
    this.subheader.sendExportEvent();
  }

  onCheckClick() {
    this.subheader.sendCheckEvent();
  }

  onPrintClick() {
    this.subheader.sendPrintEvent();
  }

  onSearchClick() {
    this.subheader.sendSearchEvent(this.search);
  }
}
