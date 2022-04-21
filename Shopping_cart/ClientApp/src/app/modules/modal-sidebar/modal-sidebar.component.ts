import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal-sidebar',
  templateUrl: './modal-sidebar.component.html',
  styleUrls: ['./modal-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
