import { Scene } from 'phaser';

export class Flower
{
    private readonly image: Phaser.GameObjects.Image;
    private readonly key: string;

    constructor (scene: Scene, x: number, y: number, key: string, scale: number)
    {
        this.key = key;
        this.image = scene.add.image(x, y, key).setScale(scale);
    }

    getBounds (output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle
    {
        return this.image.getBounds(output);
    }

    getKey (): string
    {
        return this.key;
    }

    destroy (): void
    {
        this.image.destroy();
    }
}
