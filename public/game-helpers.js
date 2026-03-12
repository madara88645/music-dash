(function (globalScope) {
    'use strict';

    const NORMAL_MODE_GUARDS = [
        {
            x: 14.5,
            y: 2.5,
            angle: 0,
            speed: 0.025,
            state: 'patrol',
            waypointIndex: 0,
            waypoints: [
                { x: 14.5, y: 2.5 },
                { x: 17.5, y: 2.5 },
                { x: 17.5, y: 4.5 },
                { x: 14.5, y: 4.5 },
            ],
            alertTimer: 0,
            stepAnim: 0,
            hitCount: 0,
            stunTimer: 0,
        },
        {
            x: 22.5,
            y: 23.5,
            angle: 0,
            speed: 0.025,
            state: 'patrol',
            waypointIndex: 0,
            waypoints: [
                { x: 22.5, y: 23.5 },
                { x: 26.5, y: 23.5 },
                { x: 26.5, y: 25.5 },
                { x: 22.5, y: 25.5 },
            ],
            alertTimer: 0,
            stepAnim: 0,
            hitCount: 0,
            stunTimer: 0,
        },
    ];

    const TEST_MODE_GUARDS = [
        {
            x: 4.5,
            y: 2.5,
            angle: 0,
            speed: 0.025,
            state: 'patrol',
            waypointIndex: 0,
            waypoints: [
                { x: 4.5, y: 2.5 },
                { x: 5.5, y: 4.5 },
                { x: 3.5, y: 4.5 },
                { x: 2.5, y: 2.5 },
            ],
            alertTimer: 0,
            stepAnim: 0,
            hitCount: 0,
            stunTimer: 0,
        },
        {
            x: 14.5,
            y: 2.5,
            angle: 0,
            speed: 0.025,
            state: 'patrol',
            waypointIndex: 0,
            waypoints: [
                { x: 14.5, y: 2.5 },
                { x: 16.5, y: 2.5 },
                { x: 16.5, y: 4.5 },
                { x: 14.5, y: 4.5 },
            ],
            alertTimer: 0,
            stepAnim: 0,
            hitCount: 0,
            stunTimer: 0,
        },
    ];

    function cloneGuard(guard) {
        return {
            ...guard,
            waypoints: guard.waypoints.map((waypoint) => ({ ...waypoint })),
        };
    }

    function resolveGameMode(search) {
        const params = new URLSearchParams(search || '');
        return {
            testMode: params.get('testMode') === '1',
        };
    }

    function buildGuardLoadout(mode) {
        const sourceGuards = mode && mode.testMode
            ? TEST_MODE_GUARDS
            : NORMAL_MODE_GUARDS;

        return sourceGuards.map(cloneGuard);
    }

    function applyContactDamage({ currentHealth, damagePerSecond, deltaSeconds }) {
        const safeHealth = Number.isFinite(currentHealth) ? currentHealth : 0;
        const safeDamagePerSecond = Number.isFinite(damagePerSecond) ? damagePerSecond : 0;
        const safeDeltaSeconds = Number.isFinite(deltaSeconds) ? Math.max(0, deltaSeconds) : 0;

        return Math.max(0, safeHealth - safeDamagePerSecond * safeDeltaSeconds);
    }

    function formatHealthValue(value) {
        if (!Number.isFinite(value)) {
            return 0;
        }

        return Math.max(0, Math.floor(value));
    }

    function registerGuardHit({ currentHits, hitsToStun }) {
        const safeCurrentHits = Number.isFinite(currentHits)
            ? Math.max(0, Math.floor(currentHits))
            : 0;
        const safeHitsToStun = Number.isFinite(hitsToStun)
            ? Math.max(1, Math.floor(hitsToStun))
            : 1;
        const nextHits = safeCurrentHits + 1;

        if (nextHits >= safeHitsToStun) {
            return {
                hitCount: 0,
                stunned: true,
            };
        }

        return {
            hitCount: nextHits,
            stunned: false,
        };
    }

    function canFireShot({ nowMs, lastShotTimeMs, cooldownMs }) {
        const safeNowMs = Number.isFinite(nowMs) ? nowMs : 0;
        const safeLastShotTimeMs = Number.isFinite(lastShotTimeMs) ? lastShotTimeMs : Number.NEGATIVE_INFINITY;
        const safeCooldownMs = Number.isFinite(cooldownMs) ? Math.max(0, cooldownMs) : 0;

        return (safeNowMs - safeLastShotTimeMs) >= safeCooldownMs;
    }

    const api = {
        applyContactDamage,
        buildGuardLoadout,
        canFireShot,
        formatHealthValue,
        registerGuardHit,
        resolveGameMode,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    if (globalScope) {
        globalScope.MusicDashGameHelpers = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
