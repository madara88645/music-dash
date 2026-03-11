(function (globalScope) {
    'use strict';

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
        if (!mode || !mode.testMode) {
            return [];
        }

        return TEST_MODE_GUARDS.map(cloneGuard);
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

    const api = {
        applyContactDamage,
        buildGuardLoadout,
        formatHealthValue,
        resolveGameMode,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    if (globalScope) {
        globalScope.MusicDashGameHelpers = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
