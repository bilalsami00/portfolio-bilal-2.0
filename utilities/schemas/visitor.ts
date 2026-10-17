import { z } from "zod";

const shortText = z.string().trim().max(120);

export const deviceTypeValues = ["Desktop", "Mobile", "Tablet", "Bot"] as const;

export const visitorDeviceSchema = z
  .object({
    deviceType: z.enum(deviceTypeValues).optional(),
    deviceBrand: shortText.nullable().optional(),
    deviceModel: shortText.nullable().optional(),
    browser: shortText.optional(),
    operatingSystem: shortText.optional(),
    screenSize: z.string().trim().max(24).optional(),
    viewportSize: z.string().trim().max(24).optional(),
    touchSupport: z.boolean().optional(),
    referrer: z.string().trim().max(2048).optional(),
  })
  .strip();

export type VisitorDeviceInput = z.infer<typeof visitorDeviceSchema>;

const pagePath = z.string().trim().min(1).max(512);
const linkHref = z.string().trim().min(1).max(2048);

export const visitorSessionCreateSchema = z
  .object({
    sessionId: z.string().uuid(),
    landingPage: pagePath,
    isReturningVisitor: z.boolean().optional().default(false),
    device: visitorDeviceSchema.optional(),
  })
  .strip();

export const visitorSessionUpdateSchema = z
  .object({
    sessionId: z.string().uuid(),
    page: pagePath.optional(),
    link: linkHref.optional(),
    links: z.array(linkHref).max(20).optional(),
    touch: z.boolean().optional(),
  })
  .strip();

export type VisitorSessionCreateInput = z.infer<
  typeof visitorSessionCreateSchema
>;
export type VisitorSessionUpdateInput = z.infer<
  typeof visitorSessionUpdateSchema
>;

export type VisitorDeviceType = (typeof deviceTypeValues)[number];

/** Shape of a `visitorSessions/{sessionId}` document. */
export type VisitorSessionDocument = {
  sessionId: string;
  ipAddress: string;
  country: string;
  city: string;
  deviceType: VisitorDeviceType;
  deviceBrand: string | null;
  deviceModel: string | null;
  browser: string;
  operatingSystem: string;
  screenSize: string;
  viewportSize: string;
  touchSupport: boolean;
  referrer: string;
  landingPage: string;
  isReturningVisitor: boolean;
  visitedPages: string[];
  clickedLinks: string[];
  sessionStart: string;
  lastActivity: string;
};
