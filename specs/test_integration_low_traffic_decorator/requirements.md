# Requirements: Low Traffic Decorator Flow Integration Tests

## R1 — Low-traffic day injects flash sale text

**WHEN** `decorate()` is called with transaction records where the target date's weekday has historically below-threshold traffic,
**THEN** the function **MUST** return a string that appends the flash sale injection text (`[Oferta Relámpago] ...`) to the original prompt.

## R2 — Normal-traffic day returns prompt unchanged

**WHEN** `decorate()` is called with transaction records where the target date's weekday has average or above-threshold traffic,
**THEN** the function **MUST** return the original prompt without modification.

## R3 — Empty transactions returns prompt unchanged

**WHEN** `decorate()` is called with an empty transaction array,
**THEN** the function **MUST** return the original prompt without modification.

## R4 — Custom date parameter routes traffic analysis

**WHEN** `decorate()` is called with an explicit `date` argument that maps to a historically low-traffic weekday,
**THEN** the function **MUST** evaluate traffic against the provided date (not the current date) and append the flash sale injection text.

## R5 — All-invalid timestamps in transactions returns prompt unchanged

**WHEN** `decorate()` is called with transactions where all `created_at` values are unparseable (e.g. `"not-a-date"`, empty strings),
**THEN** the function **MUST** return the original prompt without modification.
