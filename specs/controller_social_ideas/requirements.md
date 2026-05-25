# Requirements: Social Suggestions Controller Action

## Overview

The controller `social.controller.ts` handles incoming social post idea requests. It validates the context description input, delegates to the AI copywriter service for draft generation, and returns formatted JSON responses.

## Requirements

### R1: Input Context Validation

WHEN the controller receives a context description string,
THE system MUST assert the string length is at least 3 characters.

### R2: Validation Failure Response

IF the context description fails the minimum-length check (is null, undefined, or shorter than 3 characters),
THEN the controller MUST immediately return a 400 Bad Request response with a descriptive error message.

### R3: Successful Draft Generation

WHEN the context description passes validation,
THE controller MUST invoke the AI copywriter service (`ai.service.ts`) and
MUST return a 200 OK response containing the generated social post ideas.

### R4: Server Error Handling

IF the AI service invocation throws an unexpected error,
THEN the controller MUST catch the error and return a 500 Internal Server Error response.

### R5: Input Type Contract

WHERE the controller accepts request payloads,
THE system MUST expect a JSON body with a `context` field of type string.
