import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmploymentStatusService } from '../../services/employment-status.service';
import { EmploymentStatusRequestModel } from '../../model/employment-status.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-employment-status-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employment-status-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploymentStatusFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employmentStatusService = inject(EmploymentStatusService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly employmentStatusForm = this.fb.nonNullable.group({
    statusName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id()) {
      this.loadEmploymentStatus();
    }
  }

  private loadEmploymentStatus(): void {
    this.employmentStatusService.getEmploymentStatusById(Number(this.id())).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        const status = Array.isArray(items) ? items[0] : items;
        if (status) {
          this.employmentStatusForm.patchValue({ statusName: status.statusName });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load employment status details.');
      },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.employmentStatusForm.invalid) {
      this.employmentStatusForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.errorMessage.set('Unable to identify current user. Please login again.');
      return;
    }

    const formValue = this.employmentStatusForm.getRawValue();
    const payload: EmploymentStatusRequestModel = {
      statusName: formValue.statusName,
      userId,
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id());
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.employmentStatusService.updateEmploymentStatus(payload)
      : this.employmentStatusService.createEmploymentStatus(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/employment-statuses']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update employment status.'
              : 'Failed to create employment status.'
          );
        },
      });
  }
}
