import { init } from "@checksum-ai/runtime";
import { test as base } from "@playwright/test";

import prisma from "@calcom/prisma";

import type { ExpectedUrlDetails } from "../../../playwright.config";
import { createAppsFixture } from "../playwright/fixtures/apps";
import { createBookingsFixture } from "../playwright/fixtures/bookings";
import { createEmailsFixture } from "../playwright/fixtures/emails";
import { createEmbedsFixture } from "../playwright/fixtures/embeds";
import { createEventTypeFixture } from "../playwright/fixtures/eventTypes";
import { createFeatureFixture } from "../playwright/fixtures/features";
import { createOrgsFixture } from "../playwright/fixtures/orgs";
import { createPaymentsFixture } from "../playwright/fixtures/payments";
import { createBookingPageFixture } from "../playwright/fixtures/regularBookings";
import { createRoutingFormsFixture } from "../playwright/fixtures/routingForms";
import { createServersFixture } from "../playwright/fixtures/servers";
import { createUsersFixture } from "../playwright/fixtures/users";
import { createWebhookPageFixture } from "../playwright/fixtures/webhooks";
import { createWorkflowPageFixture } from "../playwright/fixtures/workflows";

// Initialize checksum with base test
const { test: checksumTest, defineChecksumTest, login, expect, checksumAI } = init(base);

export interface ChecksumFixtures {
  // Checksum-specific fixtures
  defineChecksumTest: typeof defineChecksumTest;
  login: typeof login;
  checksumAI: typeof checksumAI;

  // Custom Cal.com fixtures
  orgs: ReturnType<typeof createOrgsFixture>;
  users: ReturnType<typeof createUsersFixture>;
  bookings: ReturnType<typeof createBookingsFixture>;
  payments: ReturnType<typeof createPaymentsFixture>;
  embeds: ReturnType<typeof createEmbedsFixture>;
  servers: ReturnType<typeof createServersFixture>;
  prisma: typeof prisma;
  emails: ReturnType<typeof createEmailsFixture>;
  routingForms: ReturnType<typeof createRoutingFormsFixture>;
  bookingPage: ReturnType<typeof createBookingPageFixture>;
  workflowPage: ReturnType<typeof createWorkflowPageFixture>;
  features: ReturnType<typeof createFeatureFixture>;
  eventTypePage: ReturnType<typeof createEventTypeFixture>;
  appsPage: ReturnType<typeof createAppsFixture>;
  webhooks: ReturnType<typeof createWebhookPageFixture>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    //FIXME: how to restrict it to Frame only
    interface Matchers<R> {
      toBeEmbedCalLink(
        calNamespace: string,
        // eslint-disable-next-line
        getActionFiredDetails: (a: { calNamespace: string; actionType: string }) => Promise<any>,
        expectedUrlDetails?: ExpectedUrlDetails,
        isPrendered?: boolean
      ): Promise<R>;
    }
  }
}

/**
 * Extended test fixture that combines checksum functionality with custom Cal.com fixtures
 * @see https://playwright.dev/docs/test-fixtures
 */
export const test = checksumTest.extend<ChecksumFixtures>({
  // Custom Cal.com fixtures
  orgs: async ({ page }, use) => {
    const orgsFixture = createOrgsFixture(page);
    await use(orgsFixture);
  },
  users: async ({ page, context, emails }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, emails, workerInfo);
    await use(usersFixture);
  },
  bookings: async ({ page }, use, workerInfo) => {
    const bookingsFixture = createBookingsFixture(page, workerInfo);
    await use(bookingsFixture);
  },
  payments: async ({ page }, use) => {
    const paymentsFixture = createPaymentsFixture(page);
    await use(paymentsFixture);
  },
  embeds: async ({ page }, use) => {
    const embedsFixture = createEmbedsFixture(page);
    await use(embedsFixture);
  },
  servers: async ({}, use) => {
    const servers = createServersFixture();
    await use(servers);
  },
  prisma: async ({}, use) => {
    await use(prisma);
  },
  routingForms: async ({}, use) => {
    await use(createRoutingFormsFixture());
  },
  emails: async ({}, use) => {
    await use(createEmailsFixture());
  },
  bookingPage: async ({ page }, use) => {
    const bookingPage = createBookingPageFixture(page);
    await use(bookingPage);
  },
  features: async ({ page }, use) => {
    const features = createFeatureFixture(page);
    await features.init();
    await use(features);
  },
  workflowPage: async ({ page }, use) => {
    const workflowPage = createWorkflowPageFixture(page);
    await use(workflowPage);
  },
  eventTypePage: async ({ page }, use) => {
    const eventTypePage = createEventTypeFixture(page);
    await use(eventTypePage);
  },
  appsPage: async ({ page }, use) => {
    const appsPage = createAppsFixture(page);
    await use(appsPage);
  },
  webhooks: async ({ page }, use) => {
    const webhooks = createWebhookPageFixture(page);
    await use(webhooks);
  },
});

// Re-export checksum utilities for convenience
export { defineChecksumTest, login, expect, checksumAI };
