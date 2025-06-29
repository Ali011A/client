import { Component } from '@angular/core';
import { Routes, CanActivateFn } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './_resolvers/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { ResetSuccessComponent } from './Auth/reset-success/reset-success.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  {path: '', component:HomeComponent},
  {
    path:'',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
{path:'members',component:MemberListComponent},
{path:'members/:username',component:MemberDetailComponent,resolve
  :{member:memberDetailedResolver}
 },
{path:'member/edit',component:MemberEditComponent,canDeactivate:[preventUnsavedChangesGuard]},
{path:'message',component:MessagesComponent},
{path:'lists',component:ListsComponent},
{path:'admin',component:AdminPanelComponent,canActivate:[adminGuard]},    
]
  }, { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'reset-success', component: ResetSuccessComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'error', component: TestErrorsComponent},
  { path: 'server-error', component: ServerErrorComponent },
  { path: '404', component: NotFoundComponent},
];
