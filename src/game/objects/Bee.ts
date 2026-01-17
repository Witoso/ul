import { Scene } from 'phaser';
import { ANIM_KEYS, ASSET_KEYS } from '../constants';

export class Bee
{
    private readonly sprite: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly flySpeed = 220;
    private readonly turnSpeed = 2.5;
    private readonly scale = 0.15;
    private carriedFlowerKey?: string;

    constructor (scene: Scene, x: number, y: number)
    {
        this.ensureAnimation(scene);

        this.sprite = scene.add.sprite(x, y, ASSET_KEYS.Bee1);
        this.sprite.setOrigin(0.5).setScale(this.scale).play(ANIM_KEYS.BeeFly);
    }

    setControls (cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined): void
    {
        this.cursors = cursors;
    }

    update (dt: number, wrapRect: Phaser.Geom.Rectangle): void
    {
        this.handleInput(dt);
        this.wrap(wrapRect);
    }

    hasFlower (): boolean
    {
        return Boolean(this.carriedFlowerKey);
    }

    pickUpFlower (flowerKey: string): boolean
    {
        if (this.carriedFlowerKey)
        {
            return false;
        }

        this.carriedFlowerKey = flowerKey;
        return true;
    }

    dropOffFlower (): string | undefined
    {
        const key = this.carriedFlowerKey;
        this.carriedFlowerKey = undefined;
        return key;
    }

    getBounds (output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle
    {
        return this.sprite.getBounds(output);
    }

    private ensureAnimation (scene: Scene): void
    {
        if (scene.anims.exists(ANIM_KEYS.BeeFly))
        {
            return;
        }

        scene.anims.create({
            key: ANIM_KEYS.BeeFly,
            frames: [{ key: ASSET_KEYS.Bee1 }, { key: ASSET_KEYS.Bee2 }],
            frameRate: 8,
            repeat: -1
        });
    }

    private handleInput (dt: number): void
    {
        if (!this.cursors)
        {
            return;
        }

        const { left, right, up } = this.cursors;

        if (left?.isDown)
        {
            this.sprite.rotation -= this.turnSpeed * dt;
        }
        else if (right?.isDown)
        {
            this.sprite.rotation += this.turnSpeed * dt;
        }

        if (up?.isDown)
        {
            const heading = this.sprite.rotation - Math.PI / 2;
            this.sprite.x += Math.cos(heading) * this.flySpeed * dt;
            this.sprite.y += Math.sin(heading) * this.flySpeed * dt;
        }
    }

    private wrap (wrapRect: Phaser.Geom.Rectangle): void
    {
        Phaser.Actions.WrapInRectangle([this.sprite], wrapRect);
    }
}
