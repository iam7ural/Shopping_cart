import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { BreadcrumbItemModel } from '../models/breadcrumb.model';
import { LayoutService } from './layout.service';
import { SubheaderModel } from '../models/subheader.model';

// kt_header_menu
// kt_aside_menu
@Injectable({
  providedIn: 'root',
})
export class SubheaderService implements OnDestroy {
  titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Dashboard'
  );
  descriptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  breadCrumbsSubject: BehaviorSubject<
    BreadcrumbItemModel[]
  > = new BehaviorSubject<BreadcrumbItemModel[]>([]);
  subheaderVersionSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'v1'
  ); // [1-6]
  // private fields

  subheaderAddButton: BehaviorSubject<any> = new BehaviorSubject<any>({
    Show: false,
    Title: '',
  });
  subheaderToggleFilterButton: BehaviorSubject<any> = new BehaviorSubject<any>({
    Show: false,
    Title: '',
  });
  subheaderExportButton: BehaviorSubject<any>;
  subheaderCheckButton: BehaviorSubject<any>;
  subheaderPrintButton: BehaviorSubject<any>;
  subheaderSearchInput: BehaviorSubject<any>;

  private modal = new Subject<any>();
  private export = new Subject<any>();
  private check = new Subject<any>();
  private toggleFilter = new Subject<any>();
  private print = new Subject<any>();
  private search = new Subject<any>();

  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(private layout: LayoutService) {
    this.setDefaultSubheader();

    this.subheaderAddButton = new BehaviorSubject<any>({
      Show: false,
      Title: '',
    });

    this.subheaderToggleFilterButton = new BehaviorSubject<any>({
      Show: false,
      Title: '',
    });

    this.subheaderExportButton = new BehaviorSubject<any>({
      Show: false,
      Title: '',
    });
    this.subheaderCheckButton = new BehaviorSubject<any>({
      Show: false,
      Title: '',
    });
    this.subheaderPrintButton = new BehaviorSubject<any>({
      Show: false,
      Title: '',
    });

    this.subheaderSearchInput = new BehaviorSubject<any>({ Show: false });
  }

  sendModalEvent() {
    this.modal.next();
  }

  getModalEvent(): Observable<any> {
    return this.modal.asObservable();
  }

  sendToggleFilterEvent() {
    this.toggleFilter.next();
  }

  sendExportEvent() {
    this.export.next();
  }

  getExportEvent(): Observable<any> {
    return this.export.asObservable();
  }

  sendCheckEvent() {
    this.check.next();
  }

  getCheckEvent(): Observable<any> {
    return this.check.asObservable();
  }

  getToggleFilterEvent(): Observable<any> {
    return this.toggleFilter.asObservable();
  }

  sendPrintEvent() {
    this.print.next();
  }

  getPrintEvent(): Observable<any> {
    return this.print.asObservable();
  }

  sendSearchEvent(text: string) {
    this.search.next(text);
  }

  getSearchEvent(): Observable<any> {
    return this.search.asObservable();
  }

  setAddButton(data: any) {
    this.subheaderAddButton.next(data);
  }

  setToggleFilterButton(data: any) {
    this.subheaderToggleFilterButton.next(data);
  }

  setExportButton(data: any) {
    this.subheaderExportButton.next(data);
  }

  setCheckButton(data: any) {
    this.subheaderCheckButton.next(data);
  }

  setPrintButton(data: any) {
    this.subheaderPrintButton.next(data);
  }

  setSearchInput(data: any) {
    this.subheaderSearchInput.next(data);
  }

  setDefaultSubheader() {
    this.setSubheaderVersion(this.layout.getProp('subheader.layoutVersion'));
  }

  setBreadcrumbs(breadcrumbs: BreadcrumbItemModel[] = []) {
    this.breadCrumbsSubject.next(breadcrumbs);
  }

  setTitle(title: string = '') {
    this.titleSubject.next(title);
  }

  setDescription(description: string) {
    this.descriptionSubject.next(description);
  }

  private setSubheaderVersion(version: string = 'v1') {
    this.subheaderVersionSubject.next(version);
  }

  // use this method in SubheaderWrapper
  updateAfterRouteChanges(pathName) {
    const aside = this.getBreadcrumbsAndTitle('kt_aside_menu', pathName);
    const header = this.getBreadcrumbsAndTitle('kt_header_menu', pathName);
    const breadcrumbs =
      aside && aside.breadcrumbs.length > 0
        ? aside.breadcrumbs
        : header.breadcrumbs;

    this.setBreadcrumbs(breadcrumbs);

    this.setTitle(
      aside && aside.title && aside.title.length > 0
        ? aside.title
        : header.title
    );
  }

  private getLinksFromMenu(menu): HTMLAnchorElement[] {
    const parentLiElements = Array.from(
      menu.getElementsByClassName('menu-item-open') || []
    ) as HTMLElement[];
    const childLiElements = Array.from(
      menu.getElementsByClassName('menu-item-active') || []
    ) as HTMLElement[];
    const result: HTMLAnchorElement[] = [];
    parentLiElements.forEach((el) => {
      const links = Array.from(
        el.getElementsByClassName('menu-link') || []
      ) as HTMLAnchorElement[];
      if (links && links.length > 0) {
        const aLink = links[0];
        if (
          aLink.href &&
          aLink.href.length &&
          aLink.href.length > 0 &&
          aLink.innerHTML !== '/'
        ) {
          result.push(aLink);
        }
      }
    });

    childLiElements.forEach((el) => {
      const links = Array.from(
        el.getElementsByClassName('menu-link') || []
      ) as HTMLAnchorElement[];
      if (links && links.length > 0) {
        const aLink = links[0];
        if (
          aLink.href &&
          aLink.href.length &&
          aLink.href.length > 0 &&
          aLink.innerHTML !== '/'
        ) {
          result.push(aLink);
        }
      }
    });
    return result;
  }

  private getBreadcrumbsAndTitle(menuId, pathName): SubheaderModel {
    const result = new SubheaderModel();
    const menu = document.getElementById(menuId);
    if (!menu) {
      return result;
    }

    const activeLinksArray = this.getLinksFromMenu(menu);

    const activeLinks = activeLinksArray.filter((el) => el.tagName === 'A');
    if (!activeLinks) {
      return result;
    }

    activeLinks.forEach((link) => {
      const titleSpans = link.getElementsByClassName('menu-text');
      if (titleSpans) {
        const titleSpan = Array.from(titleSpans).find(
          (t) => t.innerHTML && t.innerHTML.trim().length > 0
        );
        if (titleSpan) {
          result.breadcrumbs.push({
            title: titleSpan.innerHTML,
            linkPath: link.pathname,
            linkText: titleSpan.innerHTML,
          });
        }
      }
    });
    result.title = this.getTitle(result.breadcrumbs, pathName);
    return result;
  }

  private parseUrlAndReturnPathname(href): string {
    const url = document.createElement('a');
    url.href =
      'https://developer.mozilla.org:8080/en-US/search?q=URL#search-results-close-container';

    return url.pathname;
  }

  private getTitle(breadCrumbs, pathname) {
    if (!breadCrumbs || !pathname) {
      return '';
    }

    const length = breadCrumbs.length;
    if (!length) {
      return '';
    }

    return breadCrumbs[length - 1].title;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
