import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { TrackData } from '../../models/track.model';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-track-list-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListPageComponent implements OnInit {
  tracks$!: Observable<(TrackData | null)[]>;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  readonly isrcs = [
    'NO1R42509310',
    'NO1R42511410',
    'BRC310600002',
    'BR1SP1200071',
    'BR1SP1200070',
    'BR1SP1500002',
    'BXKZM1900338',
    'BXKZM1900345',
    'QZNJX2081700',
    'QZNJX2078148'
  ];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(): void {
    this.isLoading = true;
    this.hasError = false;

    this.tracks$ = forkJoin(
      this.isrcs.map((isrc) => this.spotifyService.searchTrackByIsrc(isrc))
    ).pipe(
    );

    // Subscribe to handle loading and error states
    this.tracks$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Erro ao carregar as faixas. Verifique sua conexão ou tente novamente mais tarde.';
        console.error('Error loading tracks:', error);
      }
    });
  }

  /**
   * Filters out null tracks and sorts by title
   */
  getSortedTracks(tracks: (TrackData | null)[]): TrackData[] {
    return tracks
      .filter((track): track is TrackData => track !== null)
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}