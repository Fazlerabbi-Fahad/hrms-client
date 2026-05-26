import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import { DepartmentRequestModel } from '../../models/department.model';
import { ApiResponse } from '../../../../core/models/api.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './department-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly user = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = computed(() => !!this.id);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly departmentForm = this.fb.nonNullable.group({
    departmentName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id) {
      this.loadDepartment();
    }
  }

  private loadDepartment(): void {
    const id = this.id ? Number(this.id) : null;
    if (!id) return;

    this.departmentService.getDepartmentById(id).subscribe({
      next: (response: ApiResponse<DepartmentRequestModel>) => {
        const department = response.data;
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
    const userId = Number(this.user.getCurrentUser());
    if (!userId) {
      this.errorMessage.set('Unable to identify current user. Please login again.');
      return;
    }

    const payload: DepartmentRequestModel = {
      ...formValue,
      userId,
    };

    const request$ = this.isEditMode()
      ? this.departmentService.updateDepartment(Number(this.id), payload)
      : this.departmentService.createDepartment(payload);

    this.isSubmitting.set(true);

    request$.pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => {
        void this.router.navigate(['/department']);
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
