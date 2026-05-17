import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DesignationService } from '../../services/designation.service';
import { DesignationRequestModel } from '../../models/designation.model';

@Component({
  selector: 'app-designation-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './designation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly designationService = inject(DesignationService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly designationForm = this.fb.nonNullable.group({
    designationName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id()) {
      this.loadDesignation();
    }
  }

  private loadDesignation(): void {
    this.designationService.getDesignationById(Number(this.id())).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        const designation = Array.isArray(items) ? items[0] : items;
        if (designation) {
          this.designationForm.patchValue({ designationName: designation.designationName });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load designation details.');
      },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }

    const formValue = this.designationForm.getRawValue();
    const payload: DesignationRequestModel = {
      designationName: formValue.designationName,
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id());
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.designationService.updateDesignation(payload)
      : this.designationService.createDesignation(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/designations']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update designation.'
              : 'Failed to create designation.'
          );
        },
      });
  }
}
