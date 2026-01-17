import { Scene } from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../constants';
import { Bee } from '../objects/Bee';
import { Beehive } from '../objects/Beehive';
import { Flower } from '../objects/Flower';

export class Grass extends Scene
{
    private bee?: Bee;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly grassTileScale = 0.25;
    private wrapRect?: Phaser.Geom.Rectangle;
    private beehive?: Beehive;
    private flowers: Flower[] = [];
    private readonly boardMargin = 40;
    private readonly beehiveSpacing = 80;
    private readonly flowerSpacing = 60;
    private readonly flowersCount = 5;
    private readonly beehiveScale = 0.2;
    private readonly flowerScale = 0.3;
    private readonly pollenScale = 0.25;
    private readonly pollenCount = 6;
    private readonly flowerKeys = [
        ASSET_KEYS.Clover,
        ASSET_KEYS.Daisy,
        ASSET_KEYS.Dandelion,
        ASSET_KEYS.Lavender,
        ASSET_KEYS.Sunflower
    ];

    constructor ()
    {
        super(SCENE_KEYS.Grass);
    }

    create ()
    {
        this.createBackground();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.createBeehive();
        this.createFlowers();
        this.createBee();
        this.createWrapRect();

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start(SCENE_KEYS.MainMenu);
        });
    }

    update (_time: number, delta: number)
    {
        const dt = delta / 1000;

        if (this.wrapRect)
        {
            this.bee?.update(dt, this.wrapRect);
        }

        this.checkFlowerPickup();
        this.checkBeehiveDelivery();
    }

    private createBackground (): void
    {
        const { width, height } = this.scale.gameSize;
        const grass = this.add.tileSprite(0, 0, width, height, ASSET_KEYS.Grass).setOrigin(0);
        grass.setTileScale(this.grassTileScale, this.grassTileScale);
    }

    private createWrapRect (): void
    {
        const { width, height } = this.scale.gameSize;
        this.wrapRect = new Phaser.Geom.Rectangle(0, 0, width, height);
    }

    private createBee (): void
    {
        const { width, height } = this.scale.gameSize;
        this.bee = new Bee(this, width * 0.5, height * 0.5);
        this.bee.setControls(this.cursors);
    }

    private createBeehive (): void
    {
        const position = this.getRandomPoint(this.boardMargin);
        this.beehive = new Beehive(this, position.x, position.y, this.beehiveScale);
    }

    private createFlowers (): void
    {
        if (!this.beehive)
        {
            return;
        }

        const beehiveBounds = this.beehive.getBounds();
        const beehivePosition = new Phaser.Math.Vector2(beehiveBounds.centerX, beehiveBounds.centerY);
        const placedFlowers: Phaser.Math.Vector2[] = [];

        for (let i = 0; i < this.flowersCount; i += 1)
        {
            const flowerKey = Phaser.Utils.Array.GetRandom(this.flowerKeys);
            const position = this.getRandomPointWithSpacing(
                beehivePosition,
                this.beehiveSpacing,
                this.boardMargin,
                placedFlowers,
                this.flowerSpacing
            );
            const flower = new Flower(this, position.x, position.y, flowerKey, this.flowerScale);
            this.flowers.push(flower);
            placedFlowers.push(position);
        }
    }

    private getRandomPoint (margin: number): Phaser.Math.Vector2
    {
        const { width, height } = this.scale.gameSize;
        const x = Phaser.Math.Between(margin, width - margin);
        const y = Phaser.Math.Between(margin, height - margin);
        return new Phaser.Math.Vector2(x, y);
    }

    private getRandomPointWithSpacing (
        origin: Phaser.Math.Vector2,
        minDistanceFromOrigin: number,
        margin: number,
        existingPoints: Phaser.Math.Vector2[],
        minDistanceFromPoints: number
    ): Phaser.Math.Vector2
    {
        const attempts = 12;
        let candidate = this.getRandomPoint(margin);

        for (let i = 0; i < attempts; i += 1)
        {
            candidate = this.getRandomPoint(margin);
            if (this.isFarEnough(origin, candidate, minDistanceFromOrigin)
                && this.isFarEnoughFromAll(candidate, existingPoints, minDistanceFromPoints))
            {
                return candidate;
            }
        }

        return candidate;
    }

    private checkFlowerPickup (): void
    {
        if (!this.bee || this.bee.hasFlower() || this.flowers.length === 0)
        {
            return;
        }

        const beeBounds = this.bee.getBounds();

        for (let i = 0; i < this.flowers.length; i += 1)
        {
            const flower = this.flowers[i];
            const flowerBounds = flower.getBounds();
            if (this.isOverlapping(beeBounds, flowerBounds))
            {
                this.bee.pickUpFlower(flower.getKey());
                this.createPollenBurst(flowerBounds.centerX, flowerBounds.centerY);
                flower.destroy();
                this.flowers.splice(i, 1);
                return;
            }
        }
    }

    private checkBeehiveDelivery (): void
    {
        if (!this.bee || !this.bee.hasFlower() || !this.beehive)
        {
            return;
        }

        const beeBounds = this.bee.getBounds();
        const beehiveBounds = this.beehive.getBounds();

        if (this.isOverlapping(beeBounds, beehiveBounds))
        {
            this.bee.dropOffFlower();
            this.createPollenBurst(beehiveBounds.centerX, beehiveBounds.centerY);
        }
    }

    private isOverlapping (a: Phaser.Geom.Rectangle, b: Phaser.Geom.Rectangle): boolean
    {
        return Phaser.Geom.Intersects.RectangleToRectangle(a, b);
    }

    private createPollenBurst (x: number, y: number): void
    {
        for (let i = 0; i < this.pollenCount; i += 1)
        {
            const pollen = this.add.image(x, y, ASSET_KEYS.Pollen).setScale(this.pollenScale);
            const offsetX = Phaser.Math.Between(-20, 20);
            const offsetY = Phaser.Math.Between(-20, 20);
            const duration = Phaser.Math.Between(250, 450);

            this.tweens.add({
                targets: pollen,
                x: x + offsetX,
                y: y + offsetY,
                alpha: 0,
                scale: 0,
                duration,
                onComplete: () => {
                    pollen.destroy();
                }
            });
        }
    }

    private isFarEnough (a: Phaser.Math.Vector2, b: Phaser.Math.Vector2, minDistance: number): boolean
    {
        return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) >= minDistance;
    }

    private isFarEnoughFromAll (
        candidate: Phaser.Math.Vector2,
        points: Phaser.Math.Vector2[],
        minDistance: number
    ): boolean
    {
        for (const point of points)
        {
            if (!this.isFarEnough(point, candidate, minDistance))
            {
                return false;
            }
        }

        return true;
    }
}
