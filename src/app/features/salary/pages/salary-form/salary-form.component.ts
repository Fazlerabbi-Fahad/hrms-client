import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalaryService } from '../../services/salary.service';
import { Salary, SalaryRequestModel } from '../../models/salary.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { EmployeeService } from '../../../employees/services/employee.service';
import { ApiResponse, PaginatedData } from '../../../../core/models/api.model';
import { Employee } from '../../../employees/models/employee.model';

@Component({
  selector: 'app-salary-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './salary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly salaryService = inject(SalaryService);
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = computed(() => !!this.id);


  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly employeeOptions = signal<Employee[]>([]);

  protected readonly salaryForm = this.fb.nonNullable.group({
    employeeId: [0, [Validators.required]],
    basicSalary: [0, [Validators.required, Validators.min(0)]],
    houseAllowance: [0, [Validators.required, Validators.min(0)]],
    medicalAllowance: [0, [Validators.required, Validators.min(0)]],
    transportAllowance: [0, [Validators.min(0)]],
    effectiveFrom: [''],
    effectiveTo: ['', [Validators.required]],
  });

  constructor() {
    this.loadEmployees();
    if (this.id) {
      this.loadSalary();
    }
  }

  private loadEmployees(): void {

    let params = {
      pageNumber: 1,
      pageSize: 100,
    };

    this.employeeService.getEmployees(params).subscribe({
      next: (response) => {
        this.employeeOptions.set(response.data?.items ?? []);
      },
      error: () => {
        this.errorMessage.set('Failed to load employees.');
      },
    });
  }

  private loadSalary(): void {
    this.salaryService.getSalaryById(Number(this.id)).subscribe({
      next: (response:ApiResponse<Salary>) => {
        const salary = response.data ?? null;
        if (salary) {
          this.salaryForm.patchValue({
            basicSalary: salary.basicSalary,
            houseAllowance: salary.houseAllowance,
            medicalAllowance: salary.medicalAllowance,
            transportAllowance: salary.transportAllowance,
            effectiveFrom: salary.effectiveFrom ? new Date(salary.effectiveFrom).toISOString().split('T')[0] : '',
            effectiveTo: salary.effectiveTo ? new Date(salary.effectiveTo).toISOString().split('T')[0] : '',
          });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load salary details.');
      },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }

    const userId = Number(this.authService.getCurrentUser());
    if (!userId) {
      this.errorMessage.set('Unable to identify current user. Please login again.');
      return;
    }

    const formValue = this.salaryForm.getRawValue();
    const payload: SalaryRequestModel = {
      employeeId: formValue.employeeId,
      basicSalary: Number(formValue.basicSalary),
      houseAllowance: Number(formValue.houseAllowance),
      medicalAllowance: Number(formValue.medicalAllowance),
      transportAllowance: formValue.transportAllowance ? Number(formValue.transportAllowance) : undefined,
      effectiveFrom: formValue.effectiveFrom ? new Date(formValue.effectiveFrom) : undefined,
      effectiveTo: formValue.effectiveTo ? new Date(formValue.effectiveTo) : new Date(),
      userId,
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id);
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.salaryService.updateSalary(Number(this.id), payload)
      : this.salaryService.createSalary(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/salary']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update salary.'
              : 'Failed to create salary.'
          );
        },
      });
  }
}
