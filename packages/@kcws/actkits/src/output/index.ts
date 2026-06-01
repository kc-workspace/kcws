/**
 * Output utilities for GitHub Actions workflow commands.
 *
 * This module provides functions for setting workflow outputs that can be
 * consumed by downstream jobs or steps. Uses `@actions/core` internally
 * to write outputs to the `GITHUB_OUTPUT` file.
 *
 * @packageDocumentation
 */

export { setOutput } from "./setOutput";
