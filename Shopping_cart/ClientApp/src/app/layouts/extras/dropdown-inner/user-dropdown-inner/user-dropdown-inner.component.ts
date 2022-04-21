import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user: User;
  image: string;

  constructor(
    private layout: LayoutService,
    private auth: AuthenticationService
  ) {
    this.user = this.auth.currentUser();
    this.image = 'assets/media/users/' + this.user.Id.toString() + '.jpg';
  }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
