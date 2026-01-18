import { Scene } from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../constants';

export class Preloader extends Scene
{
    constructor ()
    {
        super(SCENE_KEYS.Preloader);
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, ASSET_KEYS.Background);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image(ASSET_KEYS.Logo, 'logo.png');
        this.load.image(ASSET_KEYS.Grass, 'grass.png');
        this.load.image(ASSET_KEYS.Bee1, 'bee1.png');
        this.load.image(ASSET_KEYS.Bee2, 'bee2.png');
        this.load.image(ASSET_KEYS.Beehive, 'beehive.png');
        this.load.image(ASSET_KEYS.Clover, 'clover.png');
        this.load.image(ASSET_KEYS.Daisy, 'daisy.png');
        this.load.image(ASSET_KEYS.Dandelion, 'dandelion.png');
        this.load.image(ASSET_KEYS.Lavender, 'lavender.png');
        this.load.image(ASSET_KEYS.Sunflower, 'sunflower.png');
        this.load.image(ASSET_KEYS.Pollen, 'pollen.png');
        this.load.audioSprite(ASSET_KEYS.Bzz, 'bzz.json', 'bzz.wav');
        this.load.audio(ASSET_KEYS.Harph, 'harph.wav');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start(SCENE_KEYS.MainMenu);
    }
}
