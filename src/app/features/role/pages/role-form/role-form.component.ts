import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { Role, RoleRequestModel } from '../../models/role.model';
import { ApiResponse } from '../../../../core/models/api.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly user = inject(AuthService);
  private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = computed(() => !!this.id);


  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly roleForm = this.fb.nonNullable.group({
    roleName: ['', [Validators.required]],
  });

  constructor() {
    if (this.id) {
      this.loadRole();
    }
  }

  private loadRole(): void {
    this.roleService.getRoleById(Number(this.id)).subscribe({
      next: (response:ApiResponse<Role>) => {
        const role = response.data ?? null;
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
      userId:Number(this.user.getCurrentUser()),
    };

    if (this.isEditMode()) {
      payload.id = Number(this.id);
    }

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.roleService.updateRole(Number(this.id), payload)
      : this.roleService.createRole(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/role']);
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
