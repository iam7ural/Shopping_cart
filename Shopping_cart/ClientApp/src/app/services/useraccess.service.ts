import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { TableExtendedService } from '../modules/crud-table';
import { TranslationService } from '../modules/i18n/translation.service';
import { SplashScreenService } from '../modules/splash-screen/splash-screen.service';
import { SidebarMenuService } from './sidebar-menu.service';



@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
  private unsubscribe: Subscription[] = [];
  menuConfig: any;
  roleid=3;
  access=0;


  constructor(
    private router: Router,
    private menu: SidebarMenuService,
  ) {
    this.getMenuConfig();
   }

   getMenuConfig() {
    // menu load
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      // this.cdr.detectChanges();
    });
    this.unsubscribe.push(menuSubscr);
  }
}
