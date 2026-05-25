# Requirements - api_social_ideas_route (Feature ID: 34)

## Overview

The API route `src/app/api/v1/social/ideas/route.ts` is a thin App Router pasamanos that accepts POST requests containing a context description, delegates to the existing `SocialController.handleSocialIdeas()`, and returns the controller's response as JSON. This route is the HTTP entry point for F3 - Story 3.1: Request idea with custom context input.

## Requirements

### R1: POST Handler Exported

The route SHALL export a named `POST` function at `src/app/api/v1/social/ideas/route.ts` following Next.js App Router route handler conventions.

### R2: Request Body Parsing

WHEN the POST handler receives a request, the route SHALL parse the JSON body to extract the `context` field as a string.

### R3: Logging on Invocation

WHEN the POST handler is invoked, the route SHALL log the invocation via `logger.info` with the extracted context value.

### R4: Successful Generation Response

WHEN `SocialController.handleSocialIdeas(context)` returns `{ success: true, data: { ideas } }`, THEN the route SHALL return a 200 HTTP response with the full controller payload via `NextResponse.json`.

### R5: Controller Error Status Mapping

WHEN `SocialController.handleSocialIdeas(context)` returns `{ success: false, status: N, error: "..." }`, THEN the route SHALL return the controller's JSON payload with the status code from `result.status`.

### R6: Unexpected Exception Fallback

IF an unexpected exception is thrown during controller invocation, THEN the route SHALL catch the error, log it via `logger.error`, and return a 500 HTTP response with `{ success: false, error: "INTERNAL_SERVER_ERROR" }`.

### R7: Integration Test Coverage

Integration tests in `tests/integration/api_social_ideas_route.test.ts` SHALL assert POST endpoint routing, 200 success response, controller error status mapping (400), and 500 fallback for unexpected exceptions.
