import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatIconModule, MatDialogModule,
  MatSelectModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { MyDirDirective } from './directives/my-dir.directive';
import { StructDirDirective } from './directives/struct-dir.directive';
import { MyPipePipe } from './pipes/my-pipe.pipe';
import { TelephonyWidgetComponent } from './telephony-widget/telephony-widget.component';
import { PhoneFormComponent } from './phone-form/phone-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MyDirDirective,
    StructDirDirective,
    MyPipePipe,
    TelephonyWidgetComponent,
    PhoneFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
