import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { AuthComponent } from './pages/auth/auth';
import { SurveyComponent } from './pages/survey/survey';
import { CameraComponent } from './pages/camera/camera';
import { ResultsComponent } from './pages/results/results';
import { History } from './pages/history/history';
import { Profile } from './pages/profile/profile';
import { PersonalInfo } from './pages/personal-info/personal-info';
import { Privacy } from './pages/privacy/privacy';
import { Help } from './pages/help/help';
import { Notifications } from './pages/notifications/notifications';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'camera', component: CameraComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'history', component: History },
  { path: 'profile', component: Profile },
  { path: 'personal-info', component: PersonalInfo },
  { path: 'privacy', component: Privacy },
  { path: 'help', component: Help },
  { path: 'notifications', component: Notifications },
];
