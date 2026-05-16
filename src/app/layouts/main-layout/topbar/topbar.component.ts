import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

type ThemeMode = 'light' | 'dark';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
	private readonly authService = inject(AuthService);
	private readonly themeService = inject(ThemeService);
	private readonly storageKey = 'hrms_theme';

	readonly menuToggle = output<void>();

	protected readonly isDark = signal(false);
	protected readonly userName = computed(() => this.authService.currentUser()?.userName ?? 'Guest User');
	protected readonly userRole = computed(() => {
		const roles = this.authService.currentUser()?.roles ?? [];
		return roles[0] ?? 'Employee';
	});

	constructor() {
		this.initializeTheme();
	}

	protected toggleTheme(): void {
		this.themeService.toggle();
	}

	protected openSidebar(): void {
		this.menuToggle.emit();
	}

	protected logout(): void {
		this.authService.logout();
	}

	private initializeTheme(): void {
		this.themeService.initializeTheme();
	}

}
