# Changelog

All notable changes to SoroWill App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-27

### Added
- Changelog validation CI step — top version in `CHANGELOG.md` must match `package.json` version (#443)
- `scripts/validate-changelog.mjs` — validates changelog/package-version sync (#443)
- `scripts/bump-version.mjs` — release helper to bump `package.json` and prepend changelog stub (#443)
- `changelog:validate` npm script (#443)
- Refactored `/changelog` page to parse `CHANGELOG.md` at build time instead of using hardcoded entries (#443)

## [1.0.0] - 2026-07-01

### Added
- Initial release of SoroWill on Stellar Soroban
- Core features: create wills, set beneficiaries, check-in mechanism
- Public stats page for protocol transparency
- Non-custodial smart contracts with immutable deployment
- Legal pages and privacy policy
- Open source under MIT license

## [0.9.0] - 2026-06-01

### Added
- Dashboard for will management
- Verification flow for beneficiaries
- Guardian onboarding process
- Inheritance trigger mechanisms
- Contract integration testing

## [0.5.0] - 2026-04-01

### Added
- Initial smart contract deployment on Soroban testnet
- Web interface prototype
- Wallet integration (Freighter)
- Basic check-in functionality
- Beneficiary configuration

[Unreleased]: https://github.com/SoroWill/sorowill-app/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SoroWill/sorowill-app/compare/v1.0.0...v0.1.0
[1.0.0]: https://github.com/SoroWill/sorowill-app/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/SoroWill/sorowill-app/compare/v0.5.0...v0.9.0
[0.5.0]: https://github.com/SoroWill/sorowill-app/releases/tag/v0.5.0
