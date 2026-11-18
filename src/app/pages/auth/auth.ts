import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkinDataService } from '../../services/skin-data';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {

  constructor(
    private data: SkinDataService,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  isLogin = true;

  name = '';
  email = '';
  password = '';

  loading = false;
  error = '';

  async submit() {
    this.error = '';

    if (!this.email || !this.password || (!this.isLogin && !this.name)) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    try {
      if (!this.isLogin) {
        await this.api.register(this.name, this.email, this.password);
      }
      const user = await this.api.login(this.email, this.password);
      this.data.saveUser(user.name, user.email);
      this.router.navigate(['/survey']);
    } catch (e: any) {
      this.error = e?.message || 'Something went wrong';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
