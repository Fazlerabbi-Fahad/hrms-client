import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalaryService } from '../../services/salary.service';
import { SalaryRequestModel } from '../../models/salary.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-salary-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './salary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly salaryService = inject(SalaryService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly salaryForm = this.fb.nonNullable.group({
    employeeId: ['', [Validators.required]],
    basicSalary: ['', [Validators.required, Validators.min(0)]],
    houseAllowance: ['', [Validators.required, Validators.min(0)]],
    medicalAllowance: ['', [Validators.required, Validators.min(0)]],
    transportAllowance: ['', [Validators.min(0)]],
    effectiveFrom: [''],
    effectiveTo: ['', [Validators.required]],
  });

  constructor() {
    if (this.id()) {
      this.loadSalary();
    }
  }

  private loadSalary(): void {
    this.salaryService.getSalaryById(Number(this.id())).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        const salary = Array.isArray(items) ? items[0] : items;
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

    const userId = this.authService.getUserIdFromToken();
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
      payload.id = Number(this.id());
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.salaryService.updateSalary(payload)
      : this.salaryService.createSalary(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/salaries']);
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
