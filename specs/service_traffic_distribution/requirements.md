# Requirements - service_traffic_distribution (Feature ID: 10)

- **R1**: WHEN calculating metrics, the service SHALL compile transaction frequencies into exactly 24 integer arrays indexed by hour (0-23) representing how many transactions occurred in each hour of the day.
- **R2**: WHEN calculating metrics, the service SHALL compile transaction frequencies into exactly 7 integer arrays indexed by weekday (0=Sunday through 6=Saturday) representing how many transactions occurred on each day of the week.
- **R3**: WHERE a transaction timestamp cannot be parsed into a valid date, THEN the service SHALL skip that record and continue processing remaining transactions without throwing.
- **R4**: WHEN the input dataset is empty, THEN the service SHALL return a distribution object containing 24 zeroed hour buckets and 7 zeroed weekday buckets.
- **R5**: WHEN computing the distribution, the service SHALL identify and expose the peak hour index (0-23) with the highest transaction count and the peak weekday index (0-6) with the highest transaction count.
- **R6**: Integration tests in `tests/integration/service_traffic_distribution.integration.test.ts` SHALL verify analytical correctness using mocked datasets covering normal distributions, empty inputs, invalid timestamps, and tie-breaking scenarios.
