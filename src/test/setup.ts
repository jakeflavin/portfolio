import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

/*
 * Nothing in a unit test may reach the network. `useDeployStatus` fetches
 * /deploy-manifest.json on mount, and letting jsdom attempt that made three
 * component tests time out intermittently. A 404 is the honest default: it is
 * exactly what dev and any un-fetched preview serve, so the hook takes its
 * absent-manifest path. A test that wants a manifest overrides this stub.
 */
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))),
  );
});
