import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './modules/crud-table';
import { TranslationService } from './modules/i18n/translation.service';
import { locale as azLang } from './modules/i18n/vocabs/az';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { SplashScreenService } from './modules/splash-screen/splash-screen.service';
import { SidebarMenuService } from './services/sidebar-menu.service';
import { UserAccessService } from './services/useraccess.service';


@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  menuConfig: any;

  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private menu: SidebarMenuService,
    private tableService: TableExtendedService,
    private userAccessService: UserAccessService
  ) {


    this.translationService.loadTranslations(azLang, enLang);
  }


  ngOnInit(): void {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          // this.isAccessable();
          document.body.classList.add('page-loaded');
        }, 500);
      }

    });
    this.unsubscribe.push(routerSubscription);

  }



  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  title = 'Black List';
}
