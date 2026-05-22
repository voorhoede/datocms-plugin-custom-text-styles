# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.2.0] - 2025-08-01
### Added
- Plugin with automatic publishing
### Changed
- Publish package signed with npm package provenance

[1.2.0]: https://github.com/voorhoede/datocms-plugin-custom-text-styles/compare/a6fa561...v1.2.0

## [2.0.0] - 2026-05-15

This major release introduces granular control over which styles and marks are available in specific Structured Text fields. **You can now configure these settings per block.**

* **Migration Step:** To keep your existing setup working exactly as it did before, navigate to your DatoCMS schema, open the settings for your Structured Text field, and scroll down to **Field add-ons**. Under **Custom Text Styles Settings**, click **Select all** for both "Allowed Styles" and "Allowed Marks", then save the field.
* **Graceful Fallback:** If no field add-on configuration is detected, the plugin will temporarily default to showing all available styles and marks to prevent immediate disruption to content editors. However, it is highly recommended to configure the add-on settings for each field.

### Added
- **Per-Field Configuration:** Introduced a new Field Add-on that allows administrators to explicitly select which Custom Styles and Custom Marks are provided to editors on a per-block basis. 

### Changed
- **Data Handling:** Refactored / improved