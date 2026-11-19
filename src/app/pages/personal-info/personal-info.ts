import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-personal-info',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css'
})
export class PersonalInfo {
  name = '';
  email = '';
  age: any = '';
  skinType = '';
  saved = false;

  constructor(private data: SkinDataService) {
    this.name = data.userName;
    this.email = data.userEmail;
    try {
      const extra = JSON.parse(localStorage.getItem('flawless_extra') || '{}');
      this.age = extra.age ?? '';
      this.skinType = extra.skinType ?? '';
    } catch {}
  }

  save() {
    this.data.saveUser(this.name, this.email);
    try {
      localStorage.setItem('flawless_extra', JSON.stringify({ age: this.age, skinType: this.skinType }));
    } catch {}
    this.saved = true;
    setTimeout(() => (this.saved = false), 2500);
  }
}
