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
    private readonly beehiveMargin = 90;
    private readonly beehiveSpacing = 140;
    private readonly flowerSpacing = 60;
    private readonly beeStartSpacing = 140;
    private readonly flowersCount = 5;
    private readonly beehiveScale = 0.2;
    private readonly flowerScale = 0.3;
    private readonly pollenScale = 0.25;
    private readonly pollenCount = 6;
    private readonly beeDepth = 2;
    private readonly timerDepth = 1;
    private readonly timerPadding = 12;
    private readonly flowerKeys = [
        ASSET_KEYS.Clover,
        ASSET_KEYS.Daisy,
        ASSET_KEYS.Dandelion,
        ASSET_KEYS.Lavender,
        ASSET_KEYS.Sunflower
    ];
    private timerText?: Phaser.GameObjects.Text;
    private timerEvent?: Phaser.Time.TimerEvent;
    private finalTimeSeconds?: number;
    private lastTimerTenths = -1;
    private bzzSound?: Phaser.Sound.BaseSound;
    private beeWasMoving = false;

    constructor ()
    {
        super(SCENE_KEYS.Grass);
    }

    create ()
    {
        this.createBackground();
        this.createTimerText();
        this.startTimer();
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.createBeehive();
        this.createFlowers();
        this.createBee();
        this.createBeeSound();
        this.createWrapRect();

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start(SCENE_KEYS.MainMenu);
        });

        this.events.once('shutdown', () => {
            this.bzzSound?.stop();
        });
    }

    update (_time: number, delta: number)
    {
        const dt = delta / 1000;

        if (this.wrapRect)
        {
            this.bee?.update(dt, this.wrapRect);
        }

        this.updateBeeSound();
        this.checkFlowerPickup();
        this.checkBeehiveDelivery();
        this.updateTimerText();
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
        this.bee.setDepth(this.beeDepth);
    }

    private createBeeSound (): void
    {
        this.bzzSound = this.sound.addAudioSprite(ASSET_KEYS.Bzz, { volume: 0.6 });
    }

    private updateBeeSound (): void
    {
        if (!this.bee || !this.bzzSound)
        {
            return;
        }

        const isMoving = this.bee.isMoving();

        if (isMoving && !this.beeWasMoving)
        {
            this.startBzz();
        }
        else if (!isMoving && this.beeWasMoving)
        {
            this.stopBzz();
        }

        this.beeWasMoving = isMoving;
    }

    private startBzz (): void
    {
        if (!this.bzzSound)
        {
            return;
        }

        this.bzzSound.stop();
        this.bzzSound.off('complete', this.handleBzzComplete, this);
        this.bzzSound.once('complete', this.handleBzzComplete, this);
        this.bzzSound.play('bzz_start');
    }

    private handleBzzComplete (): void
    {
        if (!this.bee || !this.bzzSound || !this.bee.isMoving())
        {
            return;
        }

        this.bzzSound.play('bzz_loop', { loop: true });
    }

    private stopBzz (): void
    {
        if (!this.bzzSound)
        {
            return;
        }

        this.bzzSound.off('complete', this.handleBzzComplete, this);
        this.bzzSound.stop();
    }

    private createTimerText (): void
    {
        this.timerText = this.add.text(this.timerPadding, this.timerPadding, 'Time: 0.0s', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#2b2b2b'
        });
        this.timerText.setAlpha(0.6);
        this.timerText.setDepth(this.timerDepth);
    }

    private startTimer (): void
    {
        this.timerEvent?.remove(false);
        this.finalTimeSeconds = undefined;
        this.lastTimerTenths = -1;
        this.timerEvent = this.time.addEvent({
            delay: Number.MAX_SAFE_INTEGER
        });
        this.updateTimerText(true);
    }

    private stopTimer (): void
    {
        if (!this.timerEvent || this.finalTimeSeconds !== undefined)
        {
            return;
        }

        this.finalTimeSeconds = this.getElapsedSeconds();
        this.timerEvent.paused = true;
        this.updateTimerText();
    }

    private getElapsedSeconds (): number
    {
        return this.timerEvent?.getElapsedSeconds() ?? 0;
    }

    private updateTimerText (force = false): void
    {
        if (!this.timerText)
        {
            return;
        }

        const elapsedSeconds = this.finalTimeSeconds ?? this.getElapsedSeconds();
        const tenths = Math.floor(elapsedSeconds * 10);
        if (!force && tenths === this.lastTimerTenths)
        {
            return;
        }

        this.lastTimerTenths = tenths;
        this.timerText.setText(`Time: ${(tenths / 10).toFixed(1)}s`);
    }

    private createBeehive (): void
    {
        const position = this.getRandomPoint(this.beehiveMargin);
        this.beehive = new Beehive(this, position.x, position.y, this.beehiveScale);
        this.clampBeehiveToBounds(this.beehiveMargin);
    }

    private createFlowers (): void
    {
        if (!this.beehive)
        {
            return;
        }

        const { width, height } = this.scale.gameSize;
        const beeStart = new Phaser.Math.Vector2(width * 0.5, height * 0.5);
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
                this.flowerSpacing,
                beeStart,
                this.beeStartSpacing
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
        minDistanceFromPoints: number,
        avoidPoint?: Phaser.Math.Vector2,
        avoidDistance = 0
    ): Phaser.Math.Vector2
    {
        const attempts = 12;
        let candidate = this.getRandomPoint(margin);

        for (let i = 0; i < attempts; i += 1)
        {
            candidate = this.getRandomPoint(margin);
            if (this.isFarEnough(origin, candidate, minDistanceFromOrigin)
                && this.isFarEnoughFromAll(candidate, existingPoints, minDistanceFromPoints)
                && (!avoidPoint || this.isFarEnough(avoidPoint, candidate, avoidDistance)))
            {
                return candidate;
            }
        }

        return candidate;
    }

    private clampBeehiveToBounds (padding: number): void
    {
        if (!this.beehive)
        {
            return;
        }

        const { width, height } = this.scale.gameSize;
        const bounds = this.beehive.getBounds();
        const halfWidth = bounds.width * 0.5;
        const halfHeight = bounds.height * 0.5;
        const clampedX = Phaser.Math.Clamp(bounds.centerX, padding + halfWidth, width - padding - halfWidth);
        const clampedY = Phaser.Math.Clamp(bounds.centerY, padding + halfHeight, height - padding - halfHeight);
        this.beehive.setPosition(clampedX, clampedY);
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
            if (this.flowers.length === 0)
            {
                this.stopTimer();
            }
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
