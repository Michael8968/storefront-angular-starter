import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Player from '@vimeo/player';

import { environment } from '../../../../environments/environment';
import { GetCollectionsQuery } from '../../../common/generated-types';
import { DataService } from '../../providers/data/data.service';
import { StateService } from '../../providers/state/state.service';

@Component({
    selector: 'vsf-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit, OnDestroy {

    fullscreenPreviewOpen$: Observable<number | null>;
    collections$: Observable<GetCollectionsQuery['collections']['items']>;
    heroImage: SafeUrl;
    private vimeoPlayer: Player;

    constructor(private dataService: DataService, private stateService: StateService) {
    }

    ngOnInit(): void {
        this.fullscreenPreviewOpen$ = this.stateService.select(state => state.fullscreenPreviewOpen);
        this.collections$ = this.dataService.query<GetCollectionsQuery>(GET_COLLECTIONS, {
            options: { take: 50 },
        }).pipe(map(({collections}) => collections.items));
        this.heroImage = this.getHeroImageUrl();
    }

    ngOnDestroy() {
        if (this.vimeoPlayer) {
            this.vimeoPlayer.destroy();
        }
    }

    private getHeroImageUrl(): string {
        const {apiHost, apiPort} = environment;
        return `${apiHost}:${apiPort}/assets/preview/a2/thomas-serer-420833-unsplash__preview.jpg`;
    }

    fullscreenVideoId: number | null = null;

    openFullscreenPreview(videoId: number) {
        console.log('openFullscreenPreview', videoId);
        this.fullscreenVideoId = videoId;
        this.stateService.setState('fullscreenPreviewOpen', videoId);
    }

    closeFullscreenPreview() {
        this.fullscreenVideoId = null;
        this.stateService.setState('fullscreenPreviewOpen', null);
    }

}

const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    slug
                    name
                }
                featuredAsset {
                    id
                    preview
                }
            }
        }
    }
`;
