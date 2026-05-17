import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { RoleRequestModel } from '../../models/role.model';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly roleForm = this.fb.nonNullable.group({
    roleName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id()) {
      this.loadRole();
    }
  }

  private loadRole(): void {
    this.roleService.getRoleById(Number(this.id())).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        const role = Array.isArray(items) ? items[0] : items;
        if (role) {
          this.roleForm.patchValue({ roleName: role.roleName });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load role details.');
      },
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formValue = this.roleForm.getRawValue();
    const payload: RoleRequestModel = {
      roleName: formValue.roleName,
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id());
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.roleService.updateRole(payload)
      : this.roleService.createRole(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/roles']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update role.'
              : 'Failed to create role.'
          );
        },
      });
  }
}
