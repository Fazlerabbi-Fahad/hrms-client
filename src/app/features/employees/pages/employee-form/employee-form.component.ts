import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { EmployeeRequestModel } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../services/employee.service';

type LookupOption = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="card space-y-5">
      <div>
        <h2 class="page-header">Create Employee</h2>
        <p class="page-subheader mb-0">Fill in employee details and save.</p>
      </div>

      @if (errorMessage()) {
        <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage() }}
        </div>
      }

      @if (successMessage()) {
        <div class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {{ successMessage() }}
        </div>
      }

      <form class="grid grid-cols-1 gap-4 md:grid-cols-2" [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium text-gray-700" for="name">Name *</label>
          <input id="name" class="input-field" type="text" formControlName="name" placeholder="Enter employee name" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="email">Email</label>
          <input id="email" class="input-field" type="email" formControlName="email" placeholder="Enter email" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="phoneNumber">Phone Number *</label>
          <input id="phoneNumber" class="input-field" type="text" formControlName="phoneNumber" placeholder="Enter phone number" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="dateOfBirth">Date of Birth *</label>
          <input id="dateOfBirth" class="input-field" type="date" formControlName="dateOfBirth" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="joiningDate">Joining Date *</label>
          <input id="joiningDate" class="input-field" type="date" formControlName="joiningDate" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="departmentId">Department *</label>
          <select id="departmentId" class="input-field" formControlName="departmentId">
            <option value="">Select department</option>
            @for (item of departmentOptions; track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700" for="designationId">Designation *</label>
          <select id="designationId" class="input-field" formControlName="designationId">
            <option value="">Select designation</option>
            @for (item of designationOptions; track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select>
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium text-gray-700" for="employmentStatusId">Employment Status *</label>
          <select id="employmentStatusId" class="input-field" formControlName="employmentStatusId">
            <option value="">Select status</option>
            @for (item of employmentStatusOptions; track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select>
        </div>

        <div class="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button class="btn-primary" type="submit" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Saving...' : 'Create Employee' }}
          </button>

          <a class="btn-secondary" routerLink="/employees">Cancel</a>
        </div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly departmentOptions: LookupOption[] = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Engineering' },
    { id: 4, name: 'Operations' },
  ];

  protected readonly designationOptions: LookupOption[] = [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Executive' },
    { id: 3, name: 'Engineer' },
    { id: 4, name: 'Associate' },
  ];

  protected readonly employmentStatusOptions: LookupOption[] = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'On Probation' },
    { id: 3, name: 'On Leave' },
    { id: 4, name: 'Resigned' },
  ];

  protected readonly employeeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: [''],
    phoneNumber: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    joiningDate: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    designationId: ['', [Validators.required]],
    employmentStatusId: ['', [Validators.required]],
  });

  protected onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const authUser = this.authService.getCurrentUser();
    const userId = authUser?.userId ?? authUser?.id;

    if (!userId) {
      this.errorMessage.set('Unable to identify current user. Please login again.');
      return;
    }

    const formValue = this.employeeForm.getRawValue();
    const payload: EmployeeRequestModel = {
      name: formValue.name,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      joiningDate: formValue.joiningDate,
      departmentId: Number(formValue.departmentId),
      designationId: Number(formValue.designationId),
      employmentStatusId: Number(formValue.employmentStatusId),
      userId,
    };

    this.isSubmitting.set(true);

    this.employeeService
      .createEmployee(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Employee created successfully.');
          this.employeeForm.reset({
            name: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            joiningDate: '',
            departmentId: '',
            designationId: '',
            employmentStatusId: '',
          });
          void this.router.navigate(['/employees']);
        },
        error: () => {
          this.errorMessage.set('Failed to create employee. Please try again.');
        },
      });
  }
}
