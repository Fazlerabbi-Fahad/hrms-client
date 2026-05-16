import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

type NavItem = {
	label: string;
	icon: string;
	route: string;
};

@Component({
	selector: 'app-sidebar',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './sidebar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	private readonly authService = inject(AuthService);

	readonly showCloseButton = input(false);
	readonly closeRequested = output<void>();

	// Define this inside sidebar component
	protected readonly navItems: NavItem[] = [
		{ label: 'Dashboard', icon: '📊', route: '/dashboard' },
		{ label: 'Employees', icon: '👥', route: '/employees' },
		{ label: 'Salary', icon: '💰', route: '/salary' },
		{ label: 'Settings', icon: '⚙️', route: '/settings' },
	];

	protected logout(): void {
		this.closeRequested.emit();
		this.authService.logout();
	}

	protected onNavClick(): void {
		if (this.showCloseButton()) {
			this.closeRequested.emit();
		}
	}
}
