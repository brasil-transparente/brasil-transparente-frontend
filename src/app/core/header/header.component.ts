import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { ReportType } from '../../models/tipos-relatorios.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly storageService: StorageService = inject(StorageService);
  public readonly router: Router = inject(Router);

  federalEntityName = signal('União Federal');
  federalEntityImage = signal('');
  isEstadoHovered = signal(false);
  activeReport = this.storageService.activeReport;

  reportType = ReportType;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.storageService.federalEntityName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(name => {
        this.federalEntityName.set(name);
      });
    this.storageService.federalEntityImage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(image => {
        this.federalEntityImage.set(image);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveReport(report: ReportType): void {
    this.activeReport.set(report);
  }

  onMouseOverStateButton(): void {
    this.isEstadoHovered.set(true);
  }

  onMouseOutStateButton(): void {
    this.isEstadoHovered.set(false);
  }
}
