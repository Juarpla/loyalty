# Requirements - service_low_traffic_detector (Feature ID: 37)

## Overview

This feature adds a pure business-logic method to the existing `TrafficService` class to detect whether a given date falls on a historically low-traffic weekday. Downstream features (e.g., `logic_flash_sale_injection`) will use this flag to augment promotional prompts with flash-sale suggestions.

## Requirements

- **R1**: WHEN `isLowTrafficDay` is called with a date and an array of `TransactionRecord` objects, the service MUST group the transactions by weekday (0=Sunday, 1=Monday, ..., 6=Saturday), compute the historical transaction count per weekday, and compare the target date's weekday count against a configurable threshold.

- **R2**: WHERE the target date's weekday historical transaction count falls below the threshold multiplied by the total transaction average per day, the service MUST return `true` (indicating a low-traffic day).

- **R3**: WHERE the target date's weekday historical transaction count meets or exceeds the threshold, the service MUST return `false`.

- **R4**: The `isLowTrafficDay` method MUST accept an optional `threshold` parameter (type `number`, default `0.5`), representing the fraction of average daily transactions below which a weekday is considered low-traffic.

- **R5**: IF the input transaction array is empty, the service MUST return `false` (insufficient data to determine low traffic).

- **R6**: WHEN a transaction record has an invalid or unparseable `created_at` timestamp, the service MUST skip that record and continue processing remaining transactions without throwing.

- **R7**: Integration tests in `tests/integration/service_low_traffic_detector.test.ts` MUST assert:
  - Detection correctly identifies a low-traffic weekday using mock transaction sets.
  - Detection correctly returns `false` for a normal-traffic weekday.
  - The `threshold` parameter correctly influences the detection decision.
  - An empty transaction array returns `false`.
  - Invalid timestamps are silently skipped.
