import { Scene, GameObjects } from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../constants';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    startButton: GameObjects.Text;

    constructor ()
    {
        super(SCENE_KEYS.MainMenu);
    }

    create ()
    {
        this.background = this.add.image(512, 384, ASSET_KEYS.Background);

        this.title = this.add.text(512, 460, 'UL', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.startButton = this.add.text(512, 560, 'Start', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.startButton.setInteractive({ useHandCursor: true });
        this.startButton.once('pointerdown', () => {
            if (!this.sound.isPlaying(ASSET_KEYS.Harph))
            {
                this.sound.play(ASSET_KEYS.Harph, { loop: true, volume: 0.4 });
            }
            this.scene.start(SCENE_KEYS.Grass);
        });
    }
}
