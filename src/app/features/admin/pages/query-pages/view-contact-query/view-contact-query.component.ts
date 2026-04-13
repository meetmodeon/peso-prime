import { Component } from '@angular/core';
import { ContactQueryResponse } from '../../../../../services/model/contact-query.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactQueryService } from '../../../../../services/contact-query/contact-query.service';
import { QueryStatus } from '../../../../../services/model/FileType.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-contact-query',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './view-contact-query.component.html',
  styleUrl: './view-contact-query.component.scss'
})
export class ViewContactQueryComponent {

  query: ContactQueryResponse | null = null;
  loading  = true;
  deleting = false;
  error: string | null = null;
 
  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private svc:    ContactQueryService,
  ) {}
 
  ngOnInit(): void {
    const id = +Number(this.route.snapshot.paramMap.get('id'));
 
    this.svc.getById(id).subscribe({
      next: q => {
        this.query   = q;
        this.loading = false;
      },
      error: () => {
        this.error   = 'Failed to load query details.';
        this.loading = false;
      },
    });
  }
 
  confirmDelete(): void {
    if (!this.query) return;
    if (!confirm(`Delete query from "${this.query.fullName}"? This cannot be undone.`)) return;
 
    this.deleting = true;
    this.svc.delete(this.query.id).subscribe({
      next:  () => this.router.navigate(['/admin/contacts']),
      error: () => { this.deleting = false; this.error = 'Failed to delete query.'; },
    });
  }
 
  // ── Helpers ───────────────────────────────────────────────────
 statusClass(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-50 text-amber-700 border-amber-200',
    [QueryStatus.READ]: 'bg-blue-50 text-blue-700 border-blue-200',
    [QueryStatus.REPLIED]: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return map[s];
}
 
 statusDot(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-500',
    [QueryStatus.READ]: 'bg-blue-500',
    [QueryStatus.REPLIED]: 'bg-emerald-500'
  };

  return map[s];
}
 
  initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
 
  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

}
