import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminReplyRequest, ContactQueryResponse } from '../../../../../services/model/contact-query.model';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ContactQueryService } from '../../../../../services/contact-query/contact-query.service';
import { toast } from 'ngx-sonner';
import { QueryStatus } from '../../../../../services/model/FileType.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-to-reply',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-to-reply.component.html',
  styleUrl: './admin-to-reply.component.scss'
})
export class AdminToReplyComponent {

  form!: FormGroup;
  query: ContactQueryResponse | null = null;
 
  queryId  = 0;
  loading  = true;
  submitting = false;
  error: string | null = null;
 
  constructor(
    private fb:     FormBuilder,
    private route:  ActivatedRoute,
    private router: Router,
    private svc:    ContactQueryService,
  ) {}
 
  ngOnInit(): void {
    this.queryId = Number(this.route.snapshot.paramMap.get('id'));
 
    this.form = this.fb.group({
      reply: ['', [Validators.required, Validators.minLength(10)]],
    });
 
    // Load query so we can show the original message alongside the reply box
    this.svc.getById(this.queryId).subscribe({
      next: q => {
        console.log('The response data in query is: ',q);
        this.query   = q;
        this.loading = false;
 
        // Pre-fill if editing an existing reply
        if (q.adminReply) {
          this.form.patchValue({ reply: q.adminReply });
        }
      },
      error: () => {
        this.error   = 'Failed to load query details.';
        this.loading = false;
      },
    });
  }
 
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
 
    this.submitting = true;
    this.error      = null;
    const payload:AdminReplyRequest={
      message: this.form.get('reply')?.value
    }
 
    this.svc.adminReply(this.queryId, payload).subscribe({
      next: () => {
        toast.success('Reply sent', {
          description: `Your reply to ${this.query?.fullName} was sent successfully.`,
        });
        this.router.navigate(['/admin/contacts', this.queryId]);
      },
      error: err => {
        this.submitting = false;
        this.error = err?.error?.message ?? 'Failed to send reply. Please try again.';
        toast.error('Failed to send', { description: this.error ?? '' });
      },
    });
  }
 
  get replyLength(): number { return this.form.get('reply')?.value?.length ?? 0; }
  get isInvalid():   boolean {
    const c = this.form.get('reply');
    return !!(c?.invalid && c?.touched);
  }
 
 statusClass(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-50 text-amber-700 border-amber-200',
    [QueryStatus.READ]: 'bg-blue-50 text-blue-700 border-blue-200',
    [QueryStatus.REPLIED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return map[s];
}
 
statusDot(s: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    [QueryStatus.NEW]: 'bg-amber-500',
    [QueryStatus.READ]: 'bg-blue-500',
    [QueryStatus.REPLIED]: 'bg-emerald-500',
  };

  return map[s];
}
 
  initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
 
  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

}
