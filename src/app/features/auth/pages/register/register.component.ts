import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { RoleService } from '../../../role/services/role.service';
import { Role } from '../../../role/models/role.model';

const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isLoading = signal(false);
  protected readonly isLoadingRoles = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected roles = signal<Role[]>([]);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      roleIds: [[] as number[], [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.roleService
      .getRoles()
      .pipe(finalize(() => this.isLoadingRoles.set(false)))
      .subscribe({
        next: (response) => {
          this.roles.set(response.data?.items ?? []);
          this.roles = signal(
            this.roles().filter((role) => role.roleName !== 'Admin'),
          );
        },
        error: () => {
          this.errorMessage.set('Failed to load roles. Please try again.');
        },
      });
  }

  protected isRoleSelected(roleId: number): boolean {
    return this.registerForm.getRawValue().roleIds.includes(roleId);
  }

  protected onRoleChange(event: Event, roleId: number): void {
    const checkbox = event.target as HTMLInputElement;
    const current = [...this.registerForm.getRawValue().roleIds];

    const updated = checkbox.checked
      ? [...current, roleId]
      : current.filter((id) => id !== roleId);

    this.registerForm.patchValue({ roleIds: updated });

    const roleIdsControl = this.registerForm.get('roleIds');
    roleIdsControl?.markAsTouched();
    roleIdsControl?.setErrors(updated.length === 0 ? { required: true } : null);
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const roleIds = this.registerForm.getRawValue().roleIds;
    if (roleIds.length === 0) {
      this.registerForm.get('roleIds')?.setErrors({ required: true });
      this.registerForm.get('roleIds')?.markAsTouched();
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(
            'Account created successfully! Redirecting to login...',
          );
          setTimeout(() => void this.login(), 2000);
        },
        error: () => {
          this.errorMessage.set('Registration failed. Please try again.');
        },
      });
  }

  login(): void {
    this.authService
      .login(this.registerForm.getRawValue())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage.set(
            'Login failed. Please check your username and password.',
          );
        },
      });
  }
}
