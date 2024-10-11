import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import Player from '@vimeo/player';
import { StateService } from '../../providers/state/state.service';

@Component({
  selector: 'vsf-vimeo-fullscreen-preview',
  templateUrl: './vimeo-fullscreen-preview.component.html',
  styleUrls: ['./vimeo-fullscreen-preview.component.scss']
})
export class VimeoFullscreenPreviewComponent implements OnInit, OnDestroy {
  @Input() videoId!: number; // Make videoId required and remove default value
  @Input() visible = false;
  private player: Player | null = null;

  constructor(private stateService: StateService) {}

  ngOnInit() {
    if (this.videoId) {
      this.initializePlayer();
    } else {
      console.error('Video ID is required for VimeoFullscreenPreviewComponent');
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }

  private initializePlayer() {
    if (!this.videoId) {
      console.error('Cannot initialize player: Video ID is not set');
      return;
    }

    this.player = new Player('vimeo-fullscreen-player', {
      id: this.videoId,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      loop: false,
      muted: false,
      controls: true,
      autoplay: true,
    });

    this.player.ready().then(() => {
      if (this.player) {
        this.player.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }).catch(error => {
      console.error('Error initializing Vimeo player:', error);
    });

    this.player.on('play', () => {
      console.log('play');
    });
  }

  closeFullscreen() {
    this.stateService.setState('fullscreenPreviewOpen', null);
  }
}