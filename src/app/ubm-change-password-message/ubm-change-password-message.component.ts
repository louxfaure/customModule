import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'custom-ubm-change-password-message',
  standalone: true,
  imports: [MatIconModule,TranslateModule],
  templateUrl: './ubm-change-password-message.component.html',
  styleUrl: './ubm-change-password-message.component.scss'
})
export class UbmChangePasswordMessageComponent {

}
