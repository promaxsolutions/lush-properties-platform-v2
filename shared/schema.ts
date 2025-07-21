import { pgTable, text, serial, integer, boolean, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  stage: text("stage").notNull(),
  loanApproved: real("loan_approved").notNull().default(0),
  drawn: real("drawn").notNull().default(0),
  cashSpent: real("cash_spent").notNull().default(0),
  outstanding: real("outstanding").notNull().default(0),
  entityId: text("entity_id").notNull().unique(),
  files: text("files").array().notNull().default([]),
});

export const teamInvitations = pgTable("team_invitations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // admin, broker, builder, client, investor, accountant
  projectId: integer("project_id").references(() => projects.id),
  magicToken: varchar("magic_token", { length: 128 }).notNull().unique(),
  tokenExpiry: timestamp("token_expiry").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
  status: text("status").default("pending").notNull(), // pending, active, expired
  lastLogin: timestamp("last_login"),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTeamInvitation = z.infer<typeof insertTeamInvitationSchema>;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
