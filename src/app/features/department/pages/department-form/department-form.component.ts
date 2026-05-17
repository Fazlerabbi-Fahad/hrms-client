import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import { DepartmentRequestModel } from '../../models/department.model';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './department-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly departmentForm = this.fb.nonNullable.group({
    departmentName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id()) {
      this.loadDepartment();
    }
  }

  private loadDepartment(): void {
    this.departmentService.getDepartmentById(Number(this.id())).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        const department = Array.isArray(items) ? items[0] : items;
        if (department) {
          this.departmentForm.patchValue({ departmentName: department.departmentName });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load department details.');
      },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.departmentForm.getRawValue();
    const payload: DepartmentRequestModel = {
      departmentName: formValue.departmentName,
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id());
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.departmentService.updateDepartment(payload)
      : this.departmentService.createDepartment(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/departments']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update department.'
              : 'Failed to create department.'
          );
        },
      });
  }
}
