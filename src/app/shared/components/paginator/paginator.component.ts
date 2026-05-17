import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3">

        <p class="text-sm text-gray-500">
          Showing page {{ currentPage() }} of {{ totalPages() }}
          ({{ totalCount() }} total)
        </p>

        <div class="flex items-center gap-1">
          <button
            class="btn-secondary px-3 py-1.5 text-xs"
            [disabled]="currentPage() === 1"
            (click)="pageChange.emit(currentPage() - 1)">
            Previous
          </button>

          @for (page of pages(); track page) {
            <button
              class="h-8 w-8 rounded-lg text-xs font-medium transition-colors"
              [class]="page === currentPage()
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
              (click)="pageChange.emit(page)">
              {{ page }}
            </button>
          }

          <button
            class="btn-secondary px-3 py-1.5 text-xs"
            [disabled]="currentPage() === totalPages()"
            (click)="pageChange.emit(currentPage() + 1)">
            Next
          </button>
        </div>

      </div>
    }
  `
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalCount = input.required<number>();

  readonly pageChange = output<number>();

  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
}
