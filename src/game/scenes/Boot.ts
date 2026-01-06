import { Scene } from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../constants';

export class Boot extends Scene
{
    constructor ()
    {
        super(SCENE_KEYS.Boot);
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image(ASSET_KEYS.Background, 'assets/bg.png');
    }

    create ()
    {
        this.scene.start(SCENE_KEYS.Preloader);
    }
}
