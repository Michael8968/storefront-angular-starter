import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, ElementRef } from '@angular/core';
import Player from '@vimeo/player';

@Component({
  selector: 'vsf-vimeo-player',
  templateUrl: './vimeo-player.component.html',
  styleUrls: ['./vimeo-player.component.scss']
})
export class VimeoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoId = 76979871;
  @Input() width = 300;
  @Input() height = 170;
  @Output() toggle = new EventEmitter<number>();

  isMuted = true;

  private vimeoPlayer: Player;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.initVimeoPlayer();
  }

  ngOnDestroy() {
    if (this.vimeoPlayer) {
      this.vimeoPlayer.destroy();
    }
  }

  private initVimeoPlayer() {
    this.vimeoPlayer = new Player('vimeo-video', {
      id: this.videoId,
      width: this.width,
      height: this.height,
      controls: false,
      muted: true,
      loop: true,
      autoplay: true,
    });

    this.vimeoPlayer.play();
    this.vimeoPlayer.on('play', () => {
      console.log('Played the video');
    //   const iframe = this.elementRef.nativeElement.querySelector('iframe');
    //     if (iframe) {
    //         iframe.style.pointerEvents = 'none';
    //     }
    });
    this.vimeoPlayer.ready().then(() => {
        const iframe = this.elementRef.nativeElement.querySelector('iframe');
        if (iframe) {
          iframe.style.pointerEvents = 'none';
        }
      });
  }

  onPlayerClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    console.log('Player clicked');
    this.toggle.emit(this.videoId);
  }

  onPlayerKeydown(event: KeyboardEvent) {
    console.log('Player keydown', event);
  }

  toggleMute(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isMuted = !this.isMuted;
    this.vimeoPlayer.setMuted(this.isMuted);
  }
}
